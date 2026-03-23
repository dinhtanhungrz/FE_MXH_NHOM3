import { Layout } from "../../components/Layout.js";
import { 
  getMyFriends, 
  getFriendRequests,
  acceptFriend,
  rejectFriend
} from "../../../services/friendService.js";
import { renderUserLink, renderEmpty } from "../../viewHelpers.js";import { showToast } from "../../../core/utils/helpers.js";
;

let activeTab = "friends";

export async function FriendsListPage() {
  injectFriendsStyle();
  setTimeout(init, 0);

  return Layout(`
    <div class="max-w-6xl mx-auto">
      <h1 class="text-2xl font-bold mb-6 text-center">Bạn bè</h1>

      <div class="flex justify-center gap-4 mb-6">
        <button id="tabFriends" class="tab-btn active">Danh sách bạn bè</button>
        <button id="tabRequests" class="tab-btn">Lời mời kết bạn</button>
      </div>

      <div id="friendsContainer"></div>
    </div>
  `);
}

function init() {
  document.getElementById("tabFriends").onclick = () => switchTab("friends");
  document.getElementById("tabRequests").onclick = () => switchTab("requests");

  loadFriends();
}

async function switchTab(tab) {
  activeTab = tab;

  document.querySelectorAll(".tab-btn")
    .forEach(btn => btn.classList.remove("active"));

  document.getElementById(
    tab === "friends" ? "tabFriends" : "tabRequests"
  ).classList.add("active");

  if (tab === "friends") {
    await loadFriends();
  } else {
    await loadRequests();
  }
}
async function loadFriends() {
  const container = document.getElementById("friendsContainer");
  container.innerHTML = "Loading...";

  try {
    const res = await getMyFriends(0);
    const users = res.data.content;

    renderFriends(users);
  } catch (err) {
    console.error(err);
    container.innerHTML = renderEmpty("Lỗi tải dữ liệu");
  }
}
async function loadRequests() {
  const container = document.getElementById("friendsContainer");
  container.innerHTML = "Loading...";

  try {
    const res = await getFriendRequests();
    const users = res.data;

    renderRequests(users);
  } catch (err) {
    console.error(err);
    container.innerHTML = renderEmpty("Lỗi tải lời mời");
  }
}
function renderFriends(users) {
  const container = document.getElementById("friendsContainer");

  if (!users?.length) {
    container.innerHTML = renderEmpty("Bạn chưa có bạn bè nào");
    return;
  }

  container.innerHTML = users.map(renderFriendCard).join("");
}
function renderRequests(users) {
  const container = document.getElementById("friendsContainer");

  if (!users?.length) {
    container.innerHTML = renderEmpty("Không có lời mời nào");
    return;
  }

  container.innerHTML = users.map(renderRequestCard).join("");
}
function renderFriendCard(u) {
  const avatar = u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username}`;

  return `
    <div class="friend-card fade-in">
      <img src="${avatar}" class="friend-avatar"/>

      <div class="friend-info">
        ${renderUserLink(u)}
        <div class="friend-meta">
          ${u.mutualFriendsCount || 0} bạn chung
        </div>
      </div>
    </div>
  `;
}
function renderRequestCard(u) {
  const avatar = u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username}`;

  return `
    <div class="friend-card fade-in">

      <img src="${avatar}" class="friend-avatar"/>

      <div class="friend-info">
        ${renderUserLink(u)}
      </div>

      <div class="flex gap-2">
        <button onclick="accept(${u.id})" class="btn btn-accept">
          Xác nhận
        </button>

        <button onclick="reject(${u.id})" class="btn btn-reject">
          Từ chối
        </button>
      </div>

    </div>
  `;
}
function injectFriendsStyle() {
  if (document.getElementById("friends-page-style")) return;

  const style = document.createElement("style");
  style.id = "friends-page-style";

  style.textContent = `
    /* ===== KEYFRAMES ===== */
    @keyframes fade-in-down {
      from { opacity: 0; transform: translateY(-16px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .fade-in {
      animation: fade-in-down 0.25s ease-out;
    }

    /* ===== TABS ===== */
    .tab-btn {
      padding: 8px 16px;
      border-radius: 999px;
      border: none;
      background: #e4e6eb;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .tab-btn:hover {
      background: #d8dadf;
    }

    .tab-btn.active {
      background: #1877f2;
      color: white;
    }

    /* ===== CARD ===== */
    .friend-card {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #fff;
      padding: 12px;
      border-radius: 12px;
      margin-bottom: 12px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
      transition: all 0.2s ease;
    }

    .friend-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(0,0,0,0.08);
    }

    .friend-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }

    .friend-info {
      flex: 1;
    }

    .friend-meta {
      font-size: 12px;
      color: #65676b;
    }

    /* ===== ACTION BUTTON ===== */
    .btn {
      border: none;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
    }

    .btn-accept {
      background: #1877f2;
      color: white;
    }

    .btn-reject {
      background: #e4e6eb;
    }
  `;

  document.head.appendChild(style);
}
window.accept = async (id) => {
  try {
    await acceptFriend(id);
    showToast("Đã chấp nhận lời mời");
    await loadRequests();
  } catch (err) {
    console.error(err);
  }
};

window.reject = async (id) => {
  try {
    await rejectFriend(id);
    showToast("Đã từ chối lời mời");
    await loadRequests();
  } catch (err) {
    console.error(err);
  }
}
