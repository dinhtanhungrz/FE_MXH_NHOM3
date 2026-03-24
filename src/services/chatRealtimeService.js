import { authState } from "../state/authState.js";
import { APP_CONFIG } from "../core/config/app.config.js";

const MESSAGE_DESTINATION = "/user/queue/messages";
const GROUP_DESTINATION = "/user/queue/chat-groups";
const ERROR_DESTINATION = "/user/queue/chat-errors";
const SEND_DESTINATION = "/app/chat.send";
const GROUP_TOPIC_DESTINATION = (groupId) => `/topic/chat-groups/${groupId}`;
const DEBUG_STORE_KEY = "__chatRealtimeDebug";
const DEBUG_STATE_KEY = "__chatRealtimeState";
const DEBUG_EVENT_LIMIT = 200;

const parsePayload = (payload) => {
  if (!payload) return null;

  try {
    return JSON.parse(payload);
  } catch (error) {
    console.error("Failed to parse realtime payload:", error);
    return null;
  }
};

const ensureDebugStore = () => {
  if (typeof window === "undefined") {
    return {
      events: [],
      clear() {},
      latest() {
        return [];
      },
      push(event) {
        return event;
      },
    };
  }

  if (window[DEBUG_STORE_KEY]) {
    return window[DEBUG_STORE_KEY];
  }

  const store = {
    events: [],
    clear() {
      this.events.length = 0;
    },
    latest(count = 20) {
      return this.events.slice(-count);
    },
    push(event) {
      this.events.push(event);
      if (this.events.length > DEBUG_EVENT_LIMIT) {
        this.events.shift();
      }
      return event;
    },
  };

  window[DEBUG_STORE_KEY] = store;
  return store;
};

class ChatRealtimeService {
  constructor() {
    this.client = null;
    this.connectPromise = null;
    this.disconnectPromise = null;
    this.connected = false;
    this.messageSubscription = null;
    this.groupSubscription = null;
    this.errorSubscription = null;
    this.activeGroupSubscription = null;
    this.activeGroupId = null;
    this.messageListeners = new Set();
    this.groupListeners = new Set();
    this.errorListeners = new Set();
    this.statusListeners = new Set();
    this.debugStore = ensureDebugStore();

    if (typeof window !== "undefined") {
      window[DEBUG_STATE_KEY] = () => this.getDebugState();
    }
  }

  getSocketUrl() {
    return `${APP_CONFIG.API_BASE_URL.replace(/\/api\/?$/, "")}/ws/chat`;
  }

  ensureLibraries() {
    if (!window.SockJS || !window.StompJs?.Client) {
      throw new Error("Thiếu thư viện realtime trên frontend");
    }
  }

  recordDebug(event, details = {}) {
    const entry = {
      at: new Date().toISOString(),
      event,
      ...details,
    };

    this.debugStore.push(entry);
    console.debug("[chat:realtime]", entry);
    return entry;
  }

  emitStatus(state, message = "") {
    this.recordDebug("status", { state, message });
    this.statusListeners.forEach((listener) => {
      listener({ state, message });
    });
  }

  emitToListeners(listeners, payload) {
    if (!payload) return;

    listeners.forEach((listener) => {
      listener(payload);
    });
  }

  clearSubscriptions() {
    this.messageSubscription?.unsubscribe();
    this.groupSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();
    this.activeGroupSubscription?.unsubscribe();
    this.messageSubscription = null;
    this.groupSubscription = null;
    this.errorSubscription = null;
    this.activeGroupSubscription = null;
  }

  subscribeQueues() {
    if (!this.client || !this.connected) return;

    this.messageSubscription?.unsubscribe();
    this.groupSubscription?.unsubscribe();
    this.errorSubscription?.unsubscribe();

    this.messageSubscription = this.client.subscribe(MESSAGE_DESTINATION, (frame) => {
      this.recordDebug("frame_message_queue", {
        destination: MESSAGE_DESTINATION,
        body: frame.body,
      });
      this.emitToListeners(this.messageListeners, parsePayload(frame.body));
    });

    this.groupSubscription = this.client.subscribe(GROUP_DESTINATION, (frame) => {
      this.recordDebug("frame_group_queue", {
        destination: GROUP_DESTINATION,
        body: frame.body,
      });
      this.emitToListeners(this.groupListeners, parsePayload(frame.body));
    });

    this.errorSubscription = this.client.subscribe(ERROR_DESTINATION, (frame) => {
      this.recordDebug("frame_error_queue", {
        destination: ERROR_DESTINATION,
        body: frame.body,
      });
      this.emitToListeners(this.errorListeners, parsePayload(frame.body));
    });

    this.recordDebug("subscribe_user_queues", {
      destinations: [MESSAGE_DESTINATION, GROUP_DESTINATION, ERROR_DESTINATION],
    });
  }

  subscribeActiveGroup() {
    if (!this.client || !this.connected || !this.activeGroupId) return;

    const destination = GROUP_TOPIC_DESTINATION(this.activeGroupId);
    this.activeGroupSubscription?.unsubscribe();
    this.activeGroupSubscription = this.client.subscribe(destination, (frame) => {
      this.recordDebug("frame_group_topic", {
        destination,
        groupId: this.activeGroupId,
        body: frame.body,
      });
      this.emitToListeners(this.messageListeners, parsePayload(frame.body));
    });

    this.recordDebug("subscribe_group_topic", {
      destination,
      groupId: this.activeGroupId,
    });
  }

  setActiveGroup(groupId) {
    const normalizedGroupId = Number(groupId);
    const nextGroupId = Number.isInteger(normalizedGroupId) && normalizedGroupId > 0 ? normalizedGroupId : null;

    if (this.activeGroupSubscription && this.activeGroupId) {
      this.recordDebug("unsubscribe_group_topic", {
        destination: GROUP_TOPIC_DESTINATION(this.activeGroupId),
        groupId: this.activeGroupId,
      });
      this.activeGroupSubscription.unsubscribe();
      this.activeGroupSubscription = null;
    }

    this.activeGroupId = nextGroupId;

    if (this.activeGroupId) {
      this.subscribeActiveGroup();
    }
  }

  isConnected() {
    return this.connected && Boolean(this.client?.active);
  }

  async connect() {
    if (this.disconnectPromise) {
      await this.disconnectPromise;
    }

    if (this.connected && this.client?.active) {
      this.subscribeQueues();
      this.subscribeActiveGroup();
      return;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.ensureLibraries();

    const token = authState.getAccessToken();
    if (!token) {
      throw new Error("Không tìm thấy access token để kết nối realtime");
    }

    this.emitStatus("connecting", "Đang kết nối realtime...");

    this.connectPromise = new Promise((resolve, reject) => {
      let settled = false;

      const rejectConnection = (error) => {
        this.connected = false;
        this.connectPromise = null;
        if (!settled) {
          settled = true;
          reject(error);
        }
      };

      const client = new window.StompJs.Client({
        webSocketFactory: () => new window.SockJS(this.getSocketUrl()),
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        debug: (message) => {
          this.recordDebug("stomp_debug", { message });
        },
        onConnect: (frame) => {
          settled = true;
          this.client = client;
          this.connected = true;
          this.connectPromise = null;
          this.recordDebug("connected", {
            headers: frame?.headers || null,
          });
          this.subscribeQueues();
          this.subscribeActiveGroup();
          this.emitStatus("connected", "Realtime đang hoạt động");
          resolve();
        },
        onStompError: (frame) => {
          const message = frame?.headers?.message || "Realtime broker lỗi";
          this.recordDebug("stomp_error", {
            headers: frame?.headers || null,
            body: frame?.body || "",
          });
          this.emitStatus("error", message);
          rejectConnection(new Error(message));
        },
        onWebSocketError: (event) => {
          this.recordDebug("websocket_error", {
            message: event?.message || "Không thể kết nối websocket",
          });
          this.emitStatus("error", "Không thể kết nối websocket");
          rejectConnection(new Error("Không thể kết nối websocket"));
        },
        onWebSocketClose: (event) => {
          const wasConnected = this.connected;
          this.connected = false;
          this.connectPromise = null;
          this.messageSubscription = null;
          this.groupSubscription = null;
          this.errorSubscription = null;
          this.activeGroupSubscription = null;
          this.recordDebug("websocket_close", {
            code: event?.code ?? null,
            reason: event?.reason || "",
            wasConnected,
          });
          this.emitStatus("disconnected", "Realtime đã ngắt kết nối");
        },
      });

      this.client = client;
      this.recordDebug("connect_start", {
        url: this.getSocketUrl(),
      });
      client.activate();
    }).finally(() => {
      if (!this.connected) {
        this.connectPromise = null;
      }
    });

    return this.connectPromise;
  }

  async disconnect() {
    this.clearSubscriptions();

    if (!this.client) {
      this.connected = false;
      this.connectPromise = null;
      return;
    }

    const client = this.client;
    this.client = null;
    this.connected = false;
    this.connectPromise = null;
    this.recordDebug("disconnect_start");

    this.disconnectPromise = client
      .deactivate()
      .catch((error) => {
        console.error("Realtime disconnect error:", error);
      })
      .finally(() => {
        this.disconnectPromise = null;
        this.recordDebug("disconnected");
        this.emitStatus("disconnected", "Realtime đã tắt");
      });

    return this.disconnectPromise;
  }

  sendMessage(groupId, content) {
    const normalizedGroupId = Number(groupId);
    const trimmedContent = content?.trim();

    if (!Number.isInteger(normalizedGroupId) || normalizedGroupId <= 0 || !trimmedContent) {
      throw new Error("Tin nhắn realtime không hợp lệ");
    }

    if (!this.client || !this.connected) {
      throw new Error("Realtime chưa kết nối");
    }

    const payload = {
      groupId: normalizedGroupId,
      content: trimmedContent,
    };

    this.recordDebug("publish_message", {
      destination: SEND_DESTINATION,
      payload,
    });

    this.client.publish({
      destination: SEND_DESTINATION,
      body: JSON.stringify(payload),
    });
  }

  getDebugState() {
    return {
      activeGroupId: this.activeGroupId,
      connected: this.connected,
      socketUrl: this.getSocketUrl(),
      clientActive: Boolean(this.client?.active),
    };
  }

  addMessageListener(listener) {
    this.messageListeners.add(listener);
    return () => {
      this.messageListeners.delete(listener);
    };
  }

  addGroupListener(listener) {
    this.groupListeners.add(listener);
    return () => {
      this.groupListeners.delete(listener);
    };
  }

  addErrorListener(listener) {
    this.errorListeners.add(listener);
    return () => {
      this.errorListeners.delete(listener);
    };
  }

  addStatusListener(listener) {
    this.statusListeners.add(listener);
    return () => {
      this.statusListeners.delete(listener);
    };
  }
}

export const chatRealtimeService = new ChatRealtimeService();
export default chatRealtimeService;
