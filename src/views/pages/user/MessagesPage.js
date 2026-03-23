import { Layout } from "../../components/Layout.js";
import { authState } from "../../../state/authState.js";
import { escapeHtml, formatRelativeTime, showToast } from "../../../core/utils/helpers.js";
import { getMyFriends } from "../../../services/friendService.js";
import {
  createChatGroup,
  getChatGroupById,
  getChatGroups,
  getGroupMessages,
  sendMessage as sendMessageRest,
} from "../../../services/chatService.js";
import chatRealtimeService from "../../../services/chatRealtimeService.js";

const GROUP_PAGE_SIZE = 50;
const MESSAGE_PAGE_SIZE = 50;

const state = {
  sessionId: 0,
  currentUser: null,
  groups: [],
  selectedGroupId: null,
  messageCache: new Map(),
  messageIdCache: new Map(),
  groupPreviewMap: new Map(),
  friends: [],
  friendsLoaded: false,
  selectedFriendIds: new Set(),
  cleanupFns: [],
  activeMessageRequestId: 0,
};

const getCurrentUserId = () => state.currentUser?.id ?? null;

const isOwnMessage = (message) => {
  const currentUserId = getCurrentUserId();
  if (currentUserId && message.senderId === currentUserId) return true;
  return message.senderUsername === state.currentUser?.username;
};

const getTimestampValue = (value) => {
  const timestamp = Date.parse(value || "");
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const sortGroups = () => {
  state.groups.sort((left, right) => {
    const rightPreview = state.groupPreviewMap.get(right.id);
    const leftPreview = state.groupPreviewMap.get(left.id);
    const rightValue = getTimestampValue(rightPreview?.createdAt || right.updatedAt || right.createdAt);
    const leftValue = getTimestampValue(leftPreview?.createdAt || left.updatedAt || left.createdAt);
    return rightValue - leftValue;
  });
};

const buildAvatarFallback = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Chat")}&background=2563eb&color=fff`;

const buildGroupTitle = (group) => {
  if (group.groupName?.trim()) return group.groupName.trim();

  const currentUserId = getCurrentUserId();
  const otherMembers = (group.members || []).filter((member) => member.userId !== currentUserId);
  const names = otherMembers.map((member) => member.fullName || member.username).filter(Boolean);

  return names.length > 0 ? names.join(", ") : "Nhóm chat";
};

const buildGroupAvatar = (group) => {
  if (group.avatarUrl) return group.avatarUrl;

  const currentUserId = getCurrentUserId();
  const otherMember = (group.members || []).find((member) => member.userId !== currentUserId);
  return otherMember?.avatarUrl || buildAvatarFallback(buildGroupTitle(group));
};

const normalizeGroup = (group) => {
  const normalized = {
    ...group,
    members: Array.isArray(group.members) ? group.members : [],
  };

  return {
    ...normalized,
    displayName: buildGroupTitle(normalized),
    displayAvatar: buildGroupAvatar(normalized),
    memberCount: normalized.memberCount ?? normalized.members.length ?? 0,
  };
};

const upsertGroup = (group) => {
  const normalizedGroup = normalizeGroup(group);
  const existingIndex = state.groups.findIndex((item) => item.id === normalizedGroup.id);

  if (existingIndex >= 0) {
    state.groups[existingIndex] = {
      ...state.groups[existingIndex],
      ...normalizedGroup,
    };
  } else {
    state.groups.push(normalizedGroup);
  }

  sortGroups();
  return normalizedGroup;
};

const setGroupPreviewFromMessage = (message) => {
  state.groupPreviewMap.set(message.chatGroupId, {
    text: message.deleted ? "Tin nhắn đã bị xóa" : message.content,
    createdAt: message.createdAt || message.updatedAt,
    senderUsername: message.senderUsername,
  });
};

const setMessagesForGroup = (groupId, messages) => {
  const sortedMessages = [...messages].sort((left, right) => {
    const leftValue = getTimestampValue(left.createdAt || left.updatedAt) || left.id;
    const rightValue = getTimestampValue(right.createdAt || right.updatedAt) || right.id;
    return leftValue - rightValue;
  });

  state.messageCache.set(groupId, sortedMessages);
  state.messageIdCache.set(groupId, new Set(sortedMessages.map((message) => message.id)));
};

const upsertMessageInCache = (message) => {
  const groupId = message.chatGroupId;
  const currentMessages = state.messageCache.get(groupId) || [];
  const currentIds = state.messageIdCache.get(groupId) || new Set();

  if (currentIds.has(message.id)) {
    const updatedMessages = currentMessages.map((item) =>
      item.id === message.id ? { ...item, ...message } : item,
    );
    setMessagesForGroup(groupId, updatedMessages);
    return;
  }

  setMessagesForGroup(groupId, [...currentMessages, message]);
};

const renderRealtimeStatus = (status, message = "") => {
  const statusElement = document.getElementById("chat-realtime-status");
  if (!statusElement) return;

  const styles = {
    connecting: "bg-amber-100 text-amber-700",
    connected: "bg-emerald-100 text-emerald-700",
    disconnected: "bg-slate-200 text-slate-700",
    error: "bg-rose-100 text-rose-700",
  };

  const labels = {
    connecting: "Realtime: đang kết nối",
    connected: "Realtime: đã kết nối",
    disconnected: "Realtime: đã ngắt",
    error: "Realtime: lỗi kết nối",
  };

  statusElement.className = `inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${styles[status] || styles.disconnected}`;
  statusElement.textContent = message || labels[status] || labels.disconnected;
};

const renderGroups = () => {
  const loadingElement = document.getElementById("chat-groups-loading");
  const emptyElement = document.getElementById("chat-groups-empty");
  const listElement = document.getElementById("chat-groups-list");

  if (!loadingElement || !emptyElement || !listElement) return;

  loadingElement.classList.add("hidden");

  if (state.groups.length === 0) {
    emptyElement.classList.remove("hidden");
    listElement.innerHTML = "";
    return;
  }

  emptyElement.classList.add("hidden");

  listElement.innerHTML = state.groups
    .map((group) => {
      const isActive = group.id === state.selectedGroupId;
      const preview = state.groupPreviewMap.get(group.id);
      const previewText = preview?.text || group.description || "Nhấn để xem cuộc trò chuyện";
      const previewTime = preview?.createdAt || group.updatedAt || group.createdAt;

      return `
        <button
          type="button"
          data-group-id="${group.id}"
          class="chat-group-item flex w-full items-start gap-3 rounded-2xl border px-4 py-3 text-left transition ${
            isActive
              ? "border-blue-500 bg-blue-50 shadow-sm"
              : "border-transparent bg-slate-50 hover:border-slate-200 hover:bg-white"
          }"
        >
          <img
            src="${group.displayAvatar}"
            alt="${escapeHtml(group.displayName)}"
            class="h-12 w-12 rounded-2xl object-cover"
          />
          <div class="min-w-0 flex-1">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">${escapeHtml(group.displayName)}</p>
                <p class="mt-0.5 text-xs text-slate-500">${group.memberCount} thành viên</p>
              </div>
              <span class="shrink-0 text-xs text-slate-400">${previewTime ? escapeHtml(formatRelativeTime(previewTime)) : ""}</span>
            </div>
            <p class="mt-2 truncate text-sm text-slate-600">${escapeHtml(previewText)}</p>
          </div>
        </button>
      `;
    })
    .join("");
};

const renderChatPlaceholder = (title, description) => {
  const headerElement = document.getElementById("chat-active-header");
  const messagesElement = document.getElementById("chat-messages");

  if (headerElement) {
    headerElement.innerHTML = `
      <div>
        <h2 class="text-lg font-semibold text-slate-900">${escapeHtml(title)}</h2>
        <p class="mt-1 text-sm text-slate-500">${escapeHtml(description)}</p>
      </div>
    `;
  }

  if (messagesElement) {
    messagesElement.innerHTML = `
      <div class="flex h-full min-h-[28rem] items-center justify-center px-6 py-12 text-center text-slate-500">
        <div>
          <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-100 text-slate-400">
            <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5l-2 2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-3 3-3-3z"></path>
            </svg>
          </div>
          <p class="text-base font-medium text-slate-700">${escapeHtml(title)}</p>
          <p class="mt-2 text-sm text-slate-500">${escapeHtml(description)}</p>
        </div>
      </div>
    `;
  }
};

const renderMessageComposerState = () => {
  const input = document.getElementById("chat-message-input");
  const submitButton = document.getElementById("chat-send-button");
  const hasSelectedGroup = Boolean(state.selectedGroupId);
  const hasContent = Boolean(input?.value?.trim());

  if (input) {
    input.disabled = !hasSelectedGroup;
    input.placeholder = hasSelectedGroup
      ? "Nhập tin nhắn và nhấn Enter để gửi"
      : "Chọn một nhóm chat để bắt đầu";
  }

  if (submitButton) {
    submitButton.disabled = !hasSelectedGroup || !hasContent;
  }
};

const renderMessages = () => {
  const selectedGroup = state.groups.find((group) => group.id === state.selectedGroupId);

  if (!selectedGroup) {
    renderChatPlaceholder("Chưa chọn cuộc trò chuyện", "Chọn một nhóm ở bên trái hoặc tạo nhóm mới.");
    renderMessageComposerState();
    return;
  }

  const headerElement = document.getElementById("chat-active-header");
  const messagesElement = document.getElementById("chat-messages");
  const messages = state.messageCache.get(selectedGroup.id) || [];
  const memberNames = selectedGroup.members
    .map((member) => member.fullName || member.username)
    .filter(Boolean)
    .slice(0, 4)
    .join(", ");

  if (headerElement) {
    headerElement.innerHTML = `
      <div class="flex items-center gap-3">
        <img
          src="${selectedGroup.displayAvatar}"
          alt="${escapeHtml(selectedGroup.displayName)}"
          class="h-12 w-12 rounded-2xl object-cover"
        />
        <div class="min-w-0">
          <h2 class="truncate text-lg font-semibold text-slate-900">${escapeHtml(selectedGroup.displayName)}</h2>
          <p class="mt-1 truncate text-sm text-slate-500">
            ${escapeHtml(memberNames || `${selectedGroup.memberCount} thành viên`)}
          </p>
        </div>
      </div>
    `;
  }

  if (messagesElement) {
    if (messages.length === 0) {
      messagesElement.innerHTML = `
        <div class="flex h-full min-h-[28rem] items-center justify-center px-6 py-12 text-center text-slate-500">
          <div>
            <p class="text-base font-medium text-slate-700">Chưa có tin nhắn nào</p>
            <p class="mt-2 text-sm text-slate-500">Gửi tin nhắn đầu tiên để bắt đầu cuộc trò chuyện.</p>
          </div>
        </div>
      `;
    } else {
      messagesElement.innerHTML = messages
        .map((message) => {
          const ownMessage = isOwnMessage(message);
          const bubbleClass = ownMessage
            ? "bg-blue-600 text-white"
            : "bg-slate-100 text-slate-800";
          const wrapperClass = ownMessage ? "justify-end" : "justify-start";
          const metaClass = ownMessage ? "text-blue-100" : "text-slate-500";

          return `
            <div class="flex ${wrapperClass} mb-4">
              <div class="max-w-[80%]">
                <div class="mb-1 px-1 text-xs ${metaClass}">
                  ${escapeHtml(message.senderUsername || "Unknown")} • ${escapeHtml(formatRelativeTime(message.createdAt || message.updatedAt))}
                </div>
                <div class="rounded-3xl px-4 py-3 shadow-sm ${bubbleClass}">
                  <p class="whitespace-pre-wrap break-words">${escapeHtml(message.content || "").replace(/\n/g, "<br />")}</p>
                </div>
              </div>
            </div>
          `;
        })
        .join("");
    }
  }

  renderMessageComposerState();
};

const scrollMessagesToBottom = () => {
  const messagesElement = document.getElementById("chat-messages");
  if (!messagesElement) return;
  messagesElement.scrollTop = messagesElement.scrollHeight;
};

const isActiveSession = (sessionId) => sessionId === state.sessionId;

const selectGroup = async (groupId, sessionId) => {
  const requestId = ++state.activeMessageRequestId;
  state.selectedGroupId = groupId;
  chatRealtimeService.setActiveGroup(groupId);
  renderGroups();
  renderChatPlaceholder("Đang tải cuộc trò chuyện...", "Mình đang lấy lịch sử tin nhắn mới nhất.");
  renderMessageComposerState();

  try {
    const [groupResponse, messagesResponse] = await Promise.all([
      getChatGroupById(groupId),
      getGroupMessages(groupId, 0, MESSAGE_PAGE_SIZE),
    ]);

    if (!isActiveSession(sessionId) || requestId !== state.activeMessageRequestId) return;

    const group = groupResponse?.data
      ? upsertGroup(groupResponse.data)
      : state.groups.find((item) => item.id === groupId);
    const messages = [...(messagesResponse?.data?.content || [])].reverse();

    setMessagesForGroup(groupId, messages);

    if (messages.length > 0) {
      setGroupPreviewFromMessage(messages[messages.length - 1]);
      sortGroups();
    }

    state.selectedGroupId = group?.id || groupId;
    renderGroups();
    renderMessages();
    scrollMessagesToBottom();
  } catch (error) {
    console.error("Load chat group failed:", error);
    renderChatPlaceholder("Không tải được cuộc trò chuyện", error.message || "Vui lòng thử lại sau.");
    showToast(error.message || "Không tải được cuộc trò chuyện", "error");
  }
};

const ensureGroupExists = async (groupId) => {
  const existingGroup = state.groups.find((group) => group.id === groupId);
  if (existingGroup) return existingGroup;

  try {
    const response = await getChatGroupById(groupId);
    if (!response?.data) return null;
    return upsertGroup(response.data);
  } catch (error) {
    console.error("Unable to fetch missing chat group:", error);
    return null;
  }
};

const handleRealtimeMessage = async (message, sessionId) => {
  if (!message?.chatGroupId || !isActiveSession(sessionId)) return;

  await ensureGroupExists(message.chatGroupId);
  upsertMessageInCache(message);
  setGroupPreviewFromMessage(message);
  sortGroups();
  renderGroups();

  if (state.selectedGroupId === message.chatGroupId) {
    renderMessages();
    scrollMessagesToBottom();
  }
};

const handleRealtimeGroup = async (group, sessionId) => {
  if (!group?.id || !isActiveSession(sessionId)) return;

  const normalizedGroup = upsertGroup(group);
  renderGroups();

  if (!state.selectedGroupId) {
    await selectGroup(normalizedGroup.id, sessionId);
  }
};

const loadGroups = async (sessionId) => {
  const loadingElement = document.getElementById("chat-groups-loading");
  if (loadingElement) loadingElement.classList.remove("hidden");

  try {
    const response = await getChatGroups(0, GROUP_PAGE_SIZE);
    if (!isActiveSession(sessionId)) return;

    state.groups = (response?.data?.content || []).map(normalizeGroup);
    sortGroups();
    renderGroups();

    if (state.groups.length > 0) {
      await selectGroup(state.groups[0].id, sessionId);
    } else {
      renderMessages();
    }
  } catch (error) {
    console.error("Load groups failed:", error);
    if (loadingElement) loadingElement.classList.add("hidden");
    showToast(error.message || "Không tải được danh sách nhóm chat", "error");
    renderChatPlaceholder("Không tải được danh sách chat", "Vui lòng thử lại sau.");
  }
};

const updateSelectedFriends = (friendId, checked) => {
  if (checked) {
    state.selectedFriendIds.add(friendId);
  } else {
    state.selectedFriendIds.delete(friendId);
  }
};

const renderFriendOptions = () => {
  const container = document.getElementById("chat-friends-list");
  const loading = document.getElementById("chat-friends-loading");
  const searchInput = document.getElementById("chat-friends-search");

  if (!container || !loading) return;

  if (!state.friendsLoaded) {
    loading.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }

  loading.classList.add("hidden");

  const keyword = searchInput?.value?.trim().toLowerCase() || "";
  const filteredFriends = state.friends.filter((friend) => {
    const fullName = `${friend.fullName || ""} ${friend.username || ""}`.toLowerCase();
    return fullName.includes(keyword);
  });

  if (filteredFriends.length === 0) {
    container.innerHTML = `
      <div class="rounded-2xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
        Không tìm thấy bạn bè phù hợp.
      </div>
    `;
    return;
  }

  container.innerHTML = filteredFriends
    .map((friend) => {
      const fullName = friend.fullName || friend.username;
      const checked = state.selectedFriendIds.has(friend.id) ? "checked" : "";

      return `
        <label class="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-3 py-3 hover:border-blue-200 hover:bg-blue-50">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-slate-300 text-blue-600"
            data-friend-id="${friend.id}"
            ${checked}
          />
          <img
            src="${friend.avatarUrl || buildAvatarFallback(fullName)}"
            alt="${escapeHtml(fullName)}"
            class="h-11 w-11 rounded-2xl object-cover"
          />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-slate-900">${escapeHtml(fullName)}</p>
            <p class="truncate text-xs text-slate-500">@${escapeHtml(friend.username || "")}</p>
          </div>
        </label>
      `;
    })
    .join("");
};

const loadFriends = async () => {
  if (state.friendsLoaded) {
    renderFriendOptions();
    return;
  }

  renderFriendOptions();

  try {
    let page = 0;
    let last = false;
    const allFriends = [];

    while (!last && page < 10) {
      const response = await getMyFriends(page);
      const pageData = response?.data;
      allFriends.push(...(pageData?.content || []));
      last = Boolean(pageData?.last);
      page += 1;
    }

    const friendMap = new Map();
    allFriends.forEach((friend) => {
      if (friend?.id) friendMap.set(friend.id, friend);
    });

    state.friends = [...friendMap.values()];
    state.friendsLoaded = true;
    renderFriendOptions();
  } catch (error) {
    console.error("Load friends failed:", error);
    showToast(error.message || "Không tải được danh sách bạn bè", "error");
  }
};

const openCreateGroupModal = async () => {
  const modal = document.getElementById("chat-create-group-modal");
  if (!modal) return;

  modal.classList.remove("hidden");
  await loadFriends();
};

const closeCreateGroupModal = () => {
  const modal = document.getElementById("chat-create-group-modal");
  const form = document.getElementById("chat-create-group-form");
  const searchInput = document.getElementById("chat-friends-search");

  if (form) form.reset();
  if (searchInput) searchInput.value = "";

  state.selectedFriendIds.clear();
  renderFriendOptions();

  if (modal) {
    modal.classList.add("hidden");
  }
};

const buildAutoGroupName = () => {
  const selectedFriends = state.friends.filter((friend) => state.selectedFriendIds.has(friend.id));

  if (selectedFriends.length === 1) {
    return `Chat với ${selectedFriends[0].fullName || selectedFriends[0].username}`;
  }

  return "Nhóm chat mới";
};

const handleCreateGroup = async () => {
  const groupNameInput = document.getElementById("chat-group-name");
  const descriptionInput = document.getElementById("chat-group-description");
  const submitButton = document.getElementById("chat-create-group-submit");

  if (state.selectedFriendIds.size === 0) {
    showToast("Chọn ít nhất một người bạn để tạo nhóm", "warning");
    return;
  }

  const groupName = groupNameInput?.value?.trim() || buildAutoGroupName();
  const description = descriptionInput?.value?.trim() || "";

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Đang tạo...";
  }

  try {
    const response = await createChatGroup({
      groupName,
      description,
      memberIds: [...state.selectedFriendIds],
    });

    const createdGroup = response?.data ? upsertGroup(response.data) : null;
    if (!createdGroup) {
      throw new Error("Không tạo được nhóm chat");
    }

    closeCreateGroupModal();
    renderGroups();
    await selectGroup(createdGroup.id, state.sessionId);
    showToast("Tạo nhóm chat thành công", "success");
  } catch (error) {
    console.error("Create group failed:", error);
    showToast(error.message || "Không tạo được nhóm chat", "error");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = "Tạo nhóm";
    }
  }
};

const handleSendMessage = async () => {
  const input = document.getElementById("chat-message-input");
  const submitButton = document.getElementById("chat-send-button");
  const content = input?.value?.trim();

  if (!state.selectedGroupId || !content) return;

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Đang gửi...";
  }

  try {
    if (chatRealtimeService.isConnected()) {
      chatRealtimeService.sendMessage(state.selectedGroupId, content);
    } else {
      const response = await sendMessageRest(state.selectedGroupId, content);
      const message = response?.data;

      if (!message) {
      throw new Error("Không gửi được tin nhắn");
      }

      upsertMessageInCache(message);
      setGroupPreviewFromMessage(message);
      sortGroups();
      renderGroups();
      renderMessages();
      scrollMessagesToBottom();

    }

    if (input) input.value = "";
    renderMessageComposerState();
  } catch (error) {
    console.error("Send message failed:", error);
    showToast(error.message || "Không gửi được tin nhắn", "error");
  } finally {
    if (submitButton) submitButton.textContent = "Gửi";
    renderMessageComposerState();
  }
};

const bindEvents = (sessionId) => {
  const groupsList = document.getElementById("chat-groups-list");
  const createButton = document.getElementById("chat-open-create-group");
  const closeModalButton = document.getElementById("chat-close-create-group");
  const cancelModalButton = document.getElementById("chat-cancel-create-group");
  const modal = document.getElementById("chat-create-group-modal");
  const searchInput = document.getElementById("chat-friends-search");
  const friendsList = document.getElementById("chat-friends-list");
  const createGroupSubmit = document.getElementById("chat-create-group-submit");
  const messageForm = document.getElementById("chat-message-form");
  const messageInput = document.getElementById("chat-message-input");

  groupsList?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-group-id]");
    if (!button) return;

    const groupId = Number(button.dataset.groupId);
    if (!groupId || groupId === state.selectedGroupId) return;

    await selectGroup(groupId, sessionId);
  });

  createButton?.addEventListener("click", openCreateGroupModal);
  closeModalButton?.addEventListener("click", closeCreateGroupModal);
  cancelModalButton?.addEventListener("click", closeCreateGroupModal);
  createGroupSubmit?.addEventListener("click", handleCreateGroup);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) closeCreateGroupModal();
  });

  searchInput?.addEventListener("input", renderFriendOptions);

  friendsList?.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-friend-id]");
    if (!checkbox) return;

    updateSelectedFriends(Number(checkbox.dataset.friendId), checkbox.checked);
  });

  messageForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await handleSendMessage();
  });

  messageInput?.addEventListener("input", renderMessageComposerState);

  messageInput?.addEventListener("keydown", async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage();
    }
  });
};

const setupRealtime = async (sessionId) => {
  state.cleanupFns.push(
    chatRealtimeService.addStatusListener(({ state: realtimeState, message }) => {
      if (!isActiveSession(sessionId)) return;
      renderRealtimeStatus(realtimeState, message);
    }),
  );

  state.cleanupFns.push(
    chatRealtimeService.addMessageListener((message) => {
      handleRealtimeMessage(message, sessionId).catch((error) => {
        console.error("Realtime message handler failed:", error);
      });
    }),
  );

  state.cleanupFns.push(
    chatRealtimeService.addGroupListener((group) => {
      handleRealtimeGroup(group, sessionId).catch((error) => {
        console.error("Realtime group handler failed:", error);
      });
    }),
  );

  state.cleanupFns.push(
    chatRealtimeService.addErrorListener((payload) => {
      if (!isActiveSession(sessionId)) return;
      showToast(payload?.message || "KhÃ´ng gá»­i Ä‘Æ°á»£c tin nháº¯n realtime", "error");
    }),
  );

  state.cleanupFns.push(() => {
    chatRealtimeService.setActiveGroup(null);
    chatRealtimeService.disconnect().catch((error) => {
      console.error("Realtime disconnect failed:", error);
    });
  });

  try {
    await chatRealtimeService.connect();
  } catch (error) {
    console.error("Realtime connection failed:", error);
    renderRealtimeStatus("error", error.message || "Không kết nối được realtime");
    showToast(error.message || "Không kết nối được realtime", "warning");
  }
};

const initializeState = () => {
  state.currentUser = authState.getUser();
  state.groups = [];
  state.selectedGroupId = null;
  state.messageCache = new Map();
  state.messageIdCache = new Map();
  state.groupPreviewMap = new Map();
  state.friends = [];
  state.friendsLoaded = false;
  state.selectedFriendIds = new Set();
  state.cleanupFns = [];
  state.activeMessageRequestId = 0;
  chatRealtimeService.setActiveGroup(null);
};

const initMessagesPage = async (sessionId) => {
  bindEvents(sessionId);
  renderRealtimeStatus("connecting", "Đang chuẩn bị realtime...");
  renderChatPlaceholder("Đang tải danh sách chat...", "Mình đang lấy các cuộc trò chuyện của bạn.");
  renderMessageComposerState();

  await Promise.all([loadGroups(sessionId), setupRealtime(sessionId)]);
};

export async function MessagesPage() {
  cleanupMessagesPage();
  initializeState();

  const content = `
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Realtime Chat</p>
          <h1 class="mt-2 text-3xl font-bold text-slate-900">Tin nhắn</h1>
          <p class="mt-2 text-sm text-slate-500">Chat group theo thời gian thực bằng REST + WebSocket.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <span id="chat-realtime-status" class="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
            Realtime: đang chuẩn bị
          </span>
          <button
            id="chat-open-create-group"
            type="button"
            class="rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Tạo nhóm chat
          </button>
        </div>
      </div>

      <div class="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside class="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
          <div class="mb-4 px-2">
            <h2 class="text-lg font-semibold text-slate-900">Cuộc trò chuyện</h2>
            <p class="text-sm text-slate-500">Chọn nhóm để xem tin nhắn mới nhất.</p>
          </div>

          <div id="chat-groups-loading" class="px-2 py-8 text-sm text-slate-500">
            Đang tải danh sách nhóm chat...
          </div>

          <div id="chat-groups-empty" class="hidden px-2 py-10 text-center">
            <div class="rounded-3xl bg-slate-50 px-4 py-8">
              <p class="text-base font-medium text-slate-700">Chưa có nhóm chat nào</p>
              <p class="mt-2 text-sm text-slate-500">Tạo nhóm mới để bắt đầu chat realtime.</p>
            </div>
          </div>

          <div id="chat-groups-list" class="space-y-2"></div>
        </aside>

        <section class="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div id="chat-active-header" class="border-b border-slate-200 px-6 py-5"></div>

          <div
            id="chat-messages"
            class="max-h-[65vh] min-h-[28rem] overflow-y-auto bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_100%)] px-6 py-6"
          ></div>

          <form id="chat-message-form" class="border-t border-slate-200 bg-white px-6 py-4">
            <div class="flex flex-col gap-3 md:flex-row md:items-end">
              <label class="block flex-1">
                <span class="sr-only">Tin nhắn</span>
                <textarea
                  id="chat-message-input"
                  rows="2"
                  class="w-full resize-none rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Chọn một nhóm chat để bắt đầu"
                ></textarea>
              </label>
              <button
                id="chat-send-button"
                type="submit"
                class="rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Gửi
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>

    <div
      id="chat-create-group-modal"
      class="hidden fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 py-6"
    >
      <div class="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 class="text-xl font-semibold text-slate-900">Tạo nhóm chat</h2>
            <p class="mt-1 text-sm text-slate-500">Chọn bạn bè và tạo phòng chat mới ngay trong app.</p>
          </div>
          <button
            id="chat-close-create-group"
            type="button"
            class="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <form id="chat-create-group-form" class="space-y-5 px-6 py-6">
          <div class="grid gap-4 md:grid-cols-2">
            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Tên nhóm</span>
              <input
                id="chat-group-name"
                type="text"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Ví dụ: Team dự án"
              />
            </label>

            <label class="block">
              <span class="mb-2 block text-sm font-medium text-slate-700">Mô tả</span>
              <input
                id="chat-group-description"
                type="text"
                class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                placeholder="Mô tả ngắn cho nhóm chat"
              />
            </label>
          </div>

          <label class="block">
            <span class="mb-2 block text-sm font-medium text-slate-700">Tìm bạn bè</span>
            <input
              id="chat-friends-search"
              type="search"
              class="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
              placeholder="Nhập tên hoặc username"
            />
          </label>

          <div>
            <div id="chat-friends-loading" class="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-500">
              Đang tải danh sách bạn bè...
            </div>
            <div id="chat-friends-list" class="grid max-h-[360px] gap-3 overflow-y-auto pr-1 md:grid-cols-2"></div>
          </div>

          <div class="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <button
              id="chat-cancel-create-group"
              type="button"
              class="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              id="chat-create-group-submit"
              type="button"
              class="rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Tạo nhóm
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const sessionId = ++state.sessionId;
  setTimeout(() => {
    initMessagesPage(sessionId).catch((error) => {
      console.error("Init messages page failed:", error);
      showToast(error.message || "Không khởi tạo được trang chat", "error");
    });
  }, 0);

  return Layout(content, { fullWidth: true });
}

export function cleanupMessagesPage() {
  state.sessionId += 1;
  state.cleanupFns.forEach((cleanup) => {
    try {
      cleanup();
    } catch (error) {
      console.error("Messages cleanup failed:", error);
    }
  });
  state.cleanupFns = [];
}

export default MessagesPage;
