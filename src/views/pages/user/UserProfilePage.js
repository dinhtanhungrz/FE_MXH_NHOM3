import { Layout } from "../../components/Layout.js";
import * as userController from "../../../controllers/userController.js";
import { showLoading, hideLoading, formatDate, showConfirm } from "../../../core/utils/helpers.js";
import { authState } from "../../../state/authState.js";
import * as friendService from "../../../services/friendService.js"; // used for mutual friends count
import { renderUserLink } from "../../viewHelpers.js";

/**
 * User Profile Page (View other users' profiles)
 * Hiển thị trang cá nhân của người dùng khác
 */
export const UserProfilePage = async (params) => {
  showLoading();
  let userId = params?.id;
  // Fix: Extract userId from hash if not provided (for direct navigation)
  if (!userId || userId === ":id") {
    const hashParts = window.location.hash.split("/");
    userId = hashParts[2];
  }
  // Ensure userId is a number
  userId = Number(userId);

  // Load user data
  const user = await userController.loadUserProfile(userId);

  // Get current logged-in user
  const currentUser = authState.getUser();

  hideLoading();

  if (!user) {
    return Layout(`
            <div class="text-center py-12">
                <p class="text-gray-600">Không thể tải thông tin người dùng</p>
            </div>
        `);
  }

  // Check if it's the current user's profile
  if (currentUser && currentUser.id === userId) {
    window.location.hash = "#/profile";
    return;
  }

  const friendStatus = user.relationshipStatus || "none"; // none, friends, pending_sent, pending_received

  // Determine button state and text
  let buttonState = {
    text: "Kết bạn",
    action: "add",
    style: "bg-blue-500 hover:bg-blue-600",
  };

  switch (friendStatus) {
    case "FRIENDS":
      buttonState = {
        text: "Bạn bè ▾",
        action: "friends_menu",
        style: "bg-sky-400 hover:bg-sky-600 relative",
      };
      break;
    case "PENDING_SENT":
      buttonState = {
        text: "Hủy lời mời",
        action: "cancel",
        style: "bg-gray-500 hover:bg-gray-600",
      };
      break;
    case "PENDING_RECEIVED":
      buttonState = {
        text: "Xác nhận",
        action: "accept",
        style: "bg-purple-500 hover:bg-purple-600",
        secondary: {
          text: "Từ chối",
          action: "reject",
          style: "bg-gray-400 hover:bg-gray-500",
        },
      };
      break;
    case "NONE":
    default:
      buttonState = {
        text: "Kết bạn",
        action: "add",
        style: "bg-blue-500 hover:bg-blue-600",
      };
  }

  // Get user friend list
  const friendListResponseTest = [
    {
      id: "user123",
      username: "nguyenvana",
      fullName: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      avatar: "https://example.com/avatars/user123.jpg",
      avatarUrl: "https://example.com/avatars/user123.jpg",
      bio: "Developer | Coffee lover",
      phone: "0123456789",
      address: "Hà Nội, Việt Nam",
      dateOfBirth: "1995-05-15",
      createdAt: "2023-01-15T10:30:00Z",
      postsCount: 45,
      friendsCount: 128,
    },
    {
      id: "user456",
      username: "tranthib",
      fullName: "Trần Thị B",
      email: "tranthib@example.com",
      avatar: null, // Sẽ dùng UI Avatars
      avatarUrl: null,
      bio: "Designer | Travel enthusiast",
      phone: "0987654321",
      address: "TP.HCM, Việt Nam",
      dateOfBirth: "1998-08-20",
      createdAt: "2023-03-20T14:20:00Z",
      postsCount: 32,
      friendsCount: 95,
    },
    {
      id: "user789",
      username: "levanc",
      fullName: "Lê Văn C",
      email: "levanc@example.com",
      avatarUrl: "https://example.com/avatars/user789.jpg",
      bio: null,
      phone: null,
      address: "Đà Nẵng, Việt Nam",
      dateOfBirth: null,
      createdAt: "2023-06-10T09:15:00Z",
      postsCount: 18,
      friendsCount: 67,
    },
  ];
  let friendList = [];
  try {
    const friendListResponse =
      (await userController.getFriendList?.(userId, { limit: 100 })) || friendListResponseTest;
    friendList = Array.isArray(friendListResponse)
      ? friendListResponse
      : friendListResponse?.data || [];
  } catch (error) {
    console.error("Error getting friend list:", error);
  }

  const content = `
        <div class="max-w-4xl mx-auto">
            <!-- Profile Header -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <!-- Cover Photo -->
                <div class="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                
                <!-- Profile Info -->
                <div class="px-6 pb-6">
                    <div class="flex flex-col sm:flex-row items-center sm:items-end -mt-16 sm:-mt-20">
                        <!-- Avatar -->
                        <div class="relative">
                            <img 
                                src="${user.avatarUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "User")}&size=200&background=3b82f6&color=fff`}"
                                alt="${user.username}"
                                class="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-xl object-cover"
                            />
                        </div>

                        <!-- User Info -->
                        <div class="mt-6 sm:mt-0 sm:ml-8 flex-1">
                            <!-- Name Section -->
                            <div class="mb-4">
                                <h1 class="text-3xl sm:text-4xl font-bold text-white leading-tight">
                                    ${user.fullName || user.username}
                                </h1>
                                ${renderUserLink(user)}
                            </div>
                            
                            <!-- Bio Section -->
                            ${
                              user.bio
                                ? `
                                <p class="text-gray-700 mt-4 text-base leading-relaxed max-w-3xl">
                                    ${user.bio}
                                </p>
                            `
                                : ""
                            }

                            <!-- Stats -->
                            <div class="flex gap-8 mt-6">
                                <div>
                                    <p class="text-3xl font-bold text-gray-900">${user.postsCount || 0}</p>
                                    <p class="text-sm text-gray-600 mt-1 font-medium">Bài viết</p>
                                </div>
                                <div>
                                    <p class="text-3xl font-bold text-gray-900">${user.friendsCount || 0}</p>
                                    <p class="text-sm text-gray-600 mt-1 font-medium">Bạn bè</p>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="mt-4 sm:mt-0 flex space-x-3">
                            <div class="relative">
                              <button
                                id="friendActionBtn" data-action="${buttonState.action}"
                                class="px-4 py-2 ${buttonState.style} text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium"
                              >
                                <span>${buttonState.text}</span>
                              </button>

                              <!-- Friends dropdown menu -->
                              <div
                                id="friendsDropdown"
                                class="hidden absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                              >
                                <button
                                  id="unfriendFromProfileBtn" data-action="${buttonState.action}"
                                  class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium text-sm transition"
                                >
                                  Hủy kết bạn
                                </button>
                              </div>
                            </div>
                            ${
                              buttonState.secondary
                                ? `
                                <button id="friendRejectBtn" data-action="${buttonState.secondary.action}"
                                class="px-6 py-2 ${buttonState.secondary.style} text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium">
                                    <span>${buttonState.secondary.text}</span>
                                </button>
                            `
                                : `
                                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition" data-action="${buttonState.action}">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                    </svg>
                                </button>
                            `
                            }
                        </div>
                    </div>

                    <!-- Additional Info -->
                    <div class="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                        ${
                          user.email
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                <span>${user.email}</span>
                            </div>
                        `
                            : ""
                        }
                        
                        ${
                          user.address
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                <span>${user.address}</span>
                            </div>
                        `
                            : ""
                        }
                        
                        ${
                          user.createdAt
                            ? `
                            <div class="flex items-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Tham gia ${formatDate(user.createdAt)}</span>
                            </div>
                        `
                            : ""
                        }
                    </div>
                </div>
            </div>

            <!-- Content Tabs -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                <!-- Tabs Header -->
                <div class="border-b border-gray-200">
                    <nav class="flex">
                        <button class="tab-btn px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium active" 
                        data-action="${buttonState.action}"data-tab="posts">
                            Bài viết
                        </button>
                        <button class="tab-btn px-6 py-4 text-gray-600 hover:text-gray-900 font-medium" 
                        data-action="${buttonState.action}"data-tab="about">
                            Giới thiệu
                        </button>
                        <button class="tab-btn px-6 py-4 text-gray-600 hover:text-gray-900 font-medium" 
                        data-action="${buttonState.action}"data-tab="friends">
                            Bạn bè (${user.friendsCount || 0})
                        </button>
                    </nav>
                </div>

                <!-- Tabs Content -->
                <div class="p-6">
                    <!-- Posts Section -->
                    <div id="posts-tab" class="tab-content active">
                        <div class="text-center py-12">
                            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p class="text-gray-500">Chưa có bài viết</p>
                        </div>
                    </div>

                    <!-- About Section -->
                    <div id="about-tab" class="tab-content" style="display: none;">
                        <div class="space-y-6">
                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-bold text-gray-900 mb-3">Thông tin cơ bản</h3>
                                <div class="space-y-3">
                                    ${
                                      user.email
                                        ? `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Email:</span>
                                            <span class="text-gray-900 font-medium">${user.email}</span>
                                        </div>
                                    `
                                        : ""
                                    }
                                    ${
                                      user.phone
                                        ? `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Điện thoại:</span>
                                            <span class="text-gray-900 font-medium">${user.phone}</span>
                                        </div>
                                    `
                                        : ""
                                    }
                                    ${
                                      user.address
                                        ? `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Địa chỉ:</span>
                                            <span class="text-gray-900 font-medium">${user.address}</span>
                                        </div>
                                    `
                                        : ""
                                    }
                                    ${
                                      user.dateOfBirth
                                        ? `
                                        <div class="flex justify-between">
                                            <span class="text-gray-600">Ngày sinh:</span>
                                            <span class="text-gray-900 font-medium">${formatDate(user.dateOfBirth)}</span>
                                        </div>
                                    `
                                        : ""
                                    }
                                    ${
                                      user.bio
                                        ? `
                                        <div class="flex justify-between flex-col space-y-2">
                                            <span class="text-gray-600">Giới thiệu:</span>
                                            <span class="text-gray-900">${user.bio}</span>
                                        </div>
                                    `
                                        : ""
                                    }
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-lg p-4">
                                <h3 class="font-bold text-gray-900 mb-3">Thống kê</h3>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-blue-600">${user.postsCount || 0}</div>
                                        <div class="text-sm text-gray-600">Bài viết</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl font-bold text-purple-600">${user.friendsCount || 0}</div>
                                        <div class="text-sm text-gray-600">Bạn bè</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Friends Section -->
                    <div id="friends-tab" class="tab-content" style="display: none;">
                        <!-- Friends/Mutual Tabs -->
                        <div class="mb-6">
                          <div class="mb-4 flex items-center justify-between">
                            <h3 id="friends-title" class="text-2xl font-bold text-gray-900">
                              Danh sách bạn bè
                            </h3>
                            <div>
                              <button
                                id="friends-tab-btn"
                                class="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm mr-2 active"
                              >
                                Bạn bè
                              </button>
                              <button
                                id="mutual-tab-btn"
                                class="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm"
                              >
                                Bạn chung
                              </button>
                            </div>
                          </div>

                          <!-- Loading Indicator (always present, toggled by JS) -->
                          <div id="mutual-loading" class="hidden text-center py-8">
                            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p class="text-gray-500 mt-2">Đang tải...</p>
                          </div>

                          <!-- Friends List Grid -->
                          <div id="friends-list-container" class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
                            <!-- Friends will be loaded here -->
                          </div>

                          <!-- Mutual Friends Grid -->
                          <div id="mutual-friends-container" class="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 hidden">
                            <!-- Mutual friends will be loaded here -->
                          </div>

                          <!-- End of List Message -->
                          <div id="mutual-end-message" class="hidden text-center py-8">
                            <p class="text-gray-500 text-sm">Không còn bạn chung nào</p>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

  const html = Layout(content);

  setTimeout(() => {
    initUserProfilePageEvents(user.id);
  }, 100);

  // Return wrapped HTML with event listeners
  return html;
};

// Initialize event listeners after DOM is loaded
export const initUserProfilePageEvents = async (userId) => {
    // Friends view mode state
    let friendsViewMode = "friends"; // friends | mutual
  const friendActionBtn = document.getElementById("friendActionBtn");
  const friendRejectBtn = document.getElementById("friendRejectBtn");
  const friendsDropdown = document.getElementById("friendsDropdown");
  const unfriendFromProfileBtn = document.getElementById("unfriendFromProfileBtn");
  const friendsTabBtn = document.getElementById("friends-tab-btn");
  const mutualTabBtn = document.getElementById("mutual-tab-btn");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const friendsListContainer = document.getElementById("friends-list-container");
  // Mutual friends state management
  let mutualFriendsState = {
    currentPage: 0,
    totalElements: 0,
    pageSize: 10,
    isLoading: false,
    hasMore: true,
  };

  // Elements
  const mutualTitleCount = document.getElementById("mutual-friends-count");
  const friendsTitle = document.getElementById("friends-title");
  const toggleMutualBtn = document.getElementById("toggle-mutual-btn");
  const mutualFriendsContainer = document.getElementById("mutual-friends-container");
  const mutualLoadingDiv = document.getElementById("mutual-loading");
  const mutualEndMessage = document.getElementById("mutual-end-message");
  if (mutualFriendsContainer) {
  mutualFriendsContainer.addEventListener("click", (e) => {
    const link = e.target.closest(".user-link");
    if (!link) return;

    const id = link.dataset.userId;
    if (!id) return;

    window.location.hash = `#/user-profile/${id}`;
  });
}
  // Safety check for required elements
  if (!mutualFriendsContainer) {
    console.warn("[UserProfilePage] mutual-friends-container element not found");
    return;
  }

  // Fix: Extract userId from hash if not provided (for direct navigation)
  if (!userId || userId === ":id") {
    const hashParts = window.location.hash.split("/");
    userId = hashParts[2];
  }
  // Ensure userId is a number
  userId = Number(userId);
  console.log("[debug] userId:", userId, "type:", typeof userId);

  // Helper function to render a mutual friend card
  const renderMutualFriendCard = (friend) => {
    // Count mutual friends (you might need to implement this in the backend)
    const mutualCount = friend.mutualFriendsCount || 0;
    
    return `
      <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div class="flex items-center space-x-4">
          <!-- Avatar -->
          <div class="flex-shrink-0">
            <img 
              src="${friend.avatarUrl || friend.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(friend.username || "User")}&size=80&background=3b82f6&color=fff`}"
              alt="${friend.username}"
              class="w-16 h-16 rounded-full object-cover border-2 border-blue-200"
            />
          </div>
          
          <!-- User Info -->
          <div class="flex-1 min-w-0">
<h4>
  ${renderUserLink(friend, "font-bold text-gray-900 truncate")}
</h4>            <p class="text-sm text-gray-500">@${friend.username}</p>
            <p class="text-xs text-gray-400 mt-1">${mutualCount} bạn chung</p>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <button class="view-profile-btn px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition" data-user-id="${friend.id}">
              Xem
            </button>
          </div>
        </div>
      </div>
    `;
  };

  // Loader for user friends
  const loadUserFriends = async () => {
  try {
    const resp = await userController.getFriendList(userId, { limit: 50 });
    const friends = resp?.data?.content || [];
    if (!Array.isArray(friends)) {
      console.error("Friends is not array:", friends);
      return;
    }
    friendsListContainer.innerHTML =
      friends.map(renderMutualFriendCard).join("");

    friendsListContainer.classList.remove("hidden");
    mutualFriendsContainer.classList.add("hidden");

    friendsViewMode = "friends";

    mutualFriendsState.currentPage = 0;
    mutualFriendsState.hasMore = true;

  } catch (e) {
    console.error("load friends error", e);
  }
};

  // Helper function to load mutual friends
  const loadMutualFriends = async (page = 0) => {
    if (mutualFriendsState.isLoading || !mutualFriendsState.hasMore) return;
    friendsListContainer.classList.add("hidden");
    mutualFriendsContainer.classList.remove("hidden");

friendsViewMode = "mutual";
    // Guard: do not call API if userId is null/undefined or not a number
    if (!userId || isNaN(userId)) {
      console.warn("[UserProfilePage] userId is invalid, skip mutual friends API call");
      return;
    }

    mutualFriendsState.isLoading = true;
    if (mutualLoadingDiv) mutualLoadingDiv.classList.remove("hidden");
    if (mutualEndMessage) mutualEndMessage.classList.add("hidden");

    try {
      // Ensure userId is not ":id" or null
      if (!userId || userId === ":id") {
        const hashParts = window.location.hash.split("/");
        userId = hashParts[2];
      }
      const response = await friendService.getCommonFriends(userId, page, mutualFriendsState.pageSize);
      
      const data = response;
      const friends = data?.content || [];
      const total = data?.totalElements || 0;
      const isLast = data?.last || page * mutualFriendsState.pageSize + friends.length >= total;

      mutualFriendsState.totalElements = total;
      mutualFriendsState.isLoading = false;

      // Render friends
      if (friends.length > 0) {
        const html = friends.map(renderMutualFriendCard).join("");
        if (page === 0) {
          if (mutualFriendsContainer) mutualFriendsContainer.innerHTML = html;
        } else {
          if (mutualFriendsContainer) mutualFriendsContainer.innerHTML += html;
        }
        mutualFriendsState.currentPage = page + 1;
        // Update header
        if (friendsTitle) friendsTitle.textContent = `Bạn chung (${mutualFriendsState.totalElements})`;
        if (toggleMutualBtn) toggleMutualBtn.textContent = "Xem bạn bè";
        friendsViewMode = "mutual";
      }

      // Check if there are more friends to load
      if (isLast || friends.length < mutualFriendsState.pageSize) {
        mutualFriendsState.hasMore = false;
        if (mutualFriendsState.totalElements === 0) {
          if (mutualEndMessage) mutualEndMessage.classList.remove("hidden");
        }
      }

      if (mutualLoadingDiv) mutualLoadingDiv.classList.add("hidden");
    } catch (error) {
      console.error("Error loading mutual friends:", error);
      if (mutualLoadingDiv) mutualLoadingDiv.classList.add("hidden");
      mutualFriendsState.isLoading = false;
    }
  };

  // Add event listeners to view profile buttons (move outside loadMutualFriends to avoid duplicate listeners)
  if (mutualFriendsContainer) {
    mutualFriendsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-profile-btn");
      if (!btn) return;
      const friendUserId = btn.getAttribute("data-user-id");
      window.location.hash = `#/user-profile/${friendUserId}`;
    });
  }

  // Toggle button logic
  if (toggleMutualBtn) {
    toggleMutualBtn.addEventListener("click", async () => {
      if (friendsViewMode === "friends") {
        await loadMutualFriends(0);
        if (mutualTitleCount) mutualTitleCount.textContent = mutualFriendsState.totalElements;
      } else {
        await loadUserFriends();
      }
    });
  }

  // Initialize mutual friends view with count and load first page
  try {
    const resp2 = await friendService.getCommonFriends(userId, 0, 1);
    const data = resp2?.data || resp2;
    const total = data?.totalElements || 0;

    console.log("[debug] computed mutual total:", total);
    mutualFriendsState.totalElements = total;
    if (mutualTitleCount) mutualTitleCount.textContent = total;
  } catch (e) {
    console.error("Error fetching mutual count", e);
    if (mutualTitleCount) mutualTitleCount.textContent = "0";
  }

  // Always load initial friends page
  // Load default friends list
  try {
    await loadUserFriends();
  } catch (e) {
    console.error("Error in initial load:", e);
  }

  // Infinite scroll for mutual friends
  const mutualContainer_scrollable = document.getElementById("mutual-friends-container");
  if (mutualContainer_scrollable) {
    mutualContainer_scrollable.addEventListener("scroll", async () => {
      // Check if user scrolled near the bottom
      const { scrollTop, scrollHeight, clientHeight } = mutualContainer_scrollable;
      if (scrollHeight - scrollTop - clientHeight < 200) {
        // Load more friends
        if (mutualFriendsState.hasMore && !mutualFriendsState.isLoading) {
          await loadMutualFriends(mutualFriendsState.currentPage);
        }
      }
    });
  }

  if (friendActionBtn) {
    // Clone to remove old event listeners and prevent duplicates
    if (friendActionBtn.parentNode) {
      const newFriendActionBtn = friendActionBtn.cloneNode(true);
      friendActionBtn.parentNode.replaceChild(newFriendActionBtn, friendActionBtn);

      newFriendActionBtn.addEventListener("click", async () => {
        const action = newFriendActionBtn.textContent.trim();

        if (action.startsWith("Bạn bè")) {
          friendsDropdown?.classList.toggle("hidden");
          return;
        }

        let success = false;

        newFriendActionBtn.disabled = true;
        showLoading();

        if (action === "Kết bạn") {
          success = await userController.sendFriendRequest(userId);
          if (success) {
            newFriendActionBtn.textContent = "Hủy lời mời";
            newFriendActionBtn.className =
              "px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
          }

        } else if (action === "Hủy lời mời") {
          const isOk = await showConfirm({
            title: "Hủy lời mời",
            message: "Bạn có chắc muốn hủy lời mời kết bạn không?",
            confirmText: "Xác nhận",
            cancelText: "Hủy",
          });

          if (isOk) {
            success = await userController.cancelFriendRequest(userId);
            if (success) {
              newFriendActionBtn.textContent = "Kết bạn";
              newFriendActionBtn.className =
                "px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
            }
          }

        } else if (action === "Xác nhận") {
          success = await userController.acceptFriendRequest(userId);
          if (success) {
            newFriendActionBtn.textContent = "Bạn bè ▾";
            newFriendActionBtn.className =
              "px-6 py-2 bg-sky-400 hover:bg-sky-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";

            const rejectBtn = document.getElementById("friendRejectBtn");
            if (rejectBtn) rejectBtn.remove();
          }
        }

        newFriendActionBtn.disabled = false;
        hideLoading();
      });
    }
  }

  if (friendRejectBtn) {
    // Clone to remove old event listeners and prevent duplicates
    const newFriendRejectBtn = friendRejectBtn.cloneNode(true);
    friendRejectBtn.parentNode.replaceChild(newFriendRejectBtn, friendRejectBtn);

    newFriendRejectBtn.addEventListener("click", async () => {
      const success = await userController.rejectFriendRequest(userId);
      if (success) {
        const actionBtn = document.getElementById("friendActionBtn");
        actionBtn.textContent = "Kết bạn";
        actionBtn.className =
          "px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
        newFriendRejectBtn.style.display = "none";
      }
    });
  }

  // Tab switching functionality
  // Tab switching functionality
tabBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {

    const tabName = btn.getAttribute("data-tab");

    // Remove active class from all buttons
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.remove("text-blue-600", "border-b-2", "border-blue-600");
      b.classList.add("text-gray-600", "hover:text-gray-900");
    });

    // Hide all tab contents
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.remove("active");
      content.style.display = "none";
    });

    // Activate clicked button
    btn.classList.remove("text-gray-600", "hover:text-gray-900");
    btn.classList.add("text-blue-600", "border-b-2", "border-blue-600");

    // Show corresponding tab
    const tabContent = document.getElementById(tabName + "-tab");
    if (tabContent) {
      tabContent.classList.add("active");
      tabContent.style.display = "block";
    }
  });
});

  if (friendsTabBtn) {
  friendsTabBtn.addEventListener("click", async () => {
    friendsTabBtn.classList.add("bg-blue-500");
    mutualTabBtn?.classList.remove("bg-blue-500");
    await loadUserFriends();
  });
}

if (mutualTabBtn) {
  mutualTabBtn.addEventListener("click", async () => {
    mutualTabBtn.classList.add("bg-blue-500");
    friendsTabBtn?.classList.remove("bg-blue-500");
    await loadMutualFriends(0);
  });
}
  // Initialize friend context menu
  const friendMenuBtns = document.querySelectorAll(".friend-menu-btn");
  const contextMenu = document.getElementById("friend-context-menu");
  const unfriendOption = document.getElementById("unfriend-option");

  // Close context menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".friend-menu-btn") && !e.target.closest("#friend-context-menu")) {
      contextMenu?.classList.add("hidden");
    }
  });

  // Handle friend menu button clicks
  friendMenuBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const friendCard = btn.closest(".friend-card");
      const friendId = friendCard.dataset.friendId;

      // Position context menu
      const rect = btn.getBoundingClientRect();
      contextMenu.dataset.friendId = friendId;
      contextMenu.style.top = rect.bottom + window.scrollY + 5 + "px";
      contextMenu.style.left = Math.min(rect.left, window.innerWidth - 220) + "px";
      contextMenu.classList.remove("hidden");
    });
  });

  if (unfriendFromProfileBtn) {
    // Guard: only replaceChild if parent exists
    if (unfriendFromProfileBtn.parentNode) {
      const newUnfriendBtn = unfriendFromProfileBtn.cloneNode(true);
      unfriendFromProfileBtn.parentNode.replaceChild(newUnfriendBtn, unfriendFromProfileBtn);
      newUnfriendBtn.addEventListener("click", async () => {
        const confirmed = await showConfirm({
          title: "Hủy kết bạn",
          message: "Bạn có chắc muốn hủy kết bạn không?",
          confirmText: "Xác nhận",
          cancelText: "Hủy",
        });

        if (!confirmed) return;

        const success = await userController.unfriend(userId);
        if (success) {
          friendsDropdown.classList.add("hidden");

          const actionBtn = document.getElementById("friendActionBtn");
          actionBtn.textContent = "Kết bạn";
          actionBtn.className =
            "px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
        }
      });
    }
  }


  document.addEventListener("click", (e) => {
    if (!e.target.closest("#friendActionBtn") && !e.target.closest("#friendsDropdown")) {
      friendsDropdown?.classList.add("hidden");
    }
  });

};

