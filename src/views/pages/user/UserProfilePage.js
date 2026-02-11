import { Layout } from "../../components/Layout.js";
import * as userController from "../../../controllers/userController.js";
import { showLoading, hideLoading, formatDate, showConfirm } from "../../../core/utils/helpers.js";
import { authState } from "../../../state/authState.js";

/**
 * User Profile Page (View other users' profiles)
 * Hiển thị trang cá nhân của người dùng khác
 */
export const UserProfilePage = async (userId) => {
  showLoading();

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
                                <p class="text-lg text-gray-500 mt-2 font-medium">@${user.username}</p>
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
                                id="friendActionBtn"
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
                                  id="unfriendFromProfileBtn"
                                  class="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium text-sm transition"
                                >
                                  Hủy kết bạn
                                </button>
                              </div>
                            </div>
                            ${
                              buttonState.secondary
                                ? `
                                <button id="friendRejectBtn" class="px-6 py-2 ${buttonState.secondary.style} text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium">
                                    <span>${buttonState.secondary.text}</span>
                                </button>
                            `
                                : `
                                <button class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
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
                        <button class="tab-btn px-6 py-4 text-blue-600 border-b-2 border-blue-600 font-medium active" data-tab="posts">
                            Bài viết
                        </button>
                        <button class="tab-btn px-6 py-4 text-gray-600 hover:text-gray-900 font-medium" data-tab="about">
                            Giới thiệu
                        </button>
                        <button class="tab-btn px-6 py-4 text-gray-600 hover:text-gray-900 font-medium" data-tab="friends">
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
                    <div id="about-tab" class="tab-content">
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
                    <div id="friends-tab" class="tab-content">
                            <div class="text-center py-12">
                                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM12 14a8 8 0 00-8 8v2h16v-2a8 8 0 00-8-8z"></path>
                                </svg>
                                <p class="text-gray-500 text-lg font-medium">Hiển thị danh sách bạn bè</p>
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
  const friendActionBtn = document.getElementById("friendActionBtn");
  const friendRejectBtn = document.getElementById("friendRejectBtn");
  const friendsDropdown = document.getElementById("friendsDropdown");
  const unfriendFromProfileBtn = document.getElementById("unfriendFromProfileBtn");

  const tabBtns = document.querySelectorAll(".tab-btn");

  if (friendActionBtn) {
    // Clone to remove old event listeners and prevent duplicates
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
        if (!isOk) {
          newFriendActionBtn.disabled = false;
          return;
        }
        success = await userController.cancelFriendRequest(userId);
        if (success) {
          newFriendActionBtn.textContent = "Kết bạn";
          newFriendActionBtn.className =
            "px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
        }
      } else if (action === "Xác nhận") {
        // success = await userController.acceptFriendRequest(userId);
        if (success) {
          newFriendActionBtn.textContent = "Bạn bè";
          newFriendActionBtn.className =
            "px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center justify-center space-x-2 font-medium";
          const rejectBtn = document.getElementById("friendRejectBtn");
          if (rejectBtn) {
            rejectBtn.style.display = "none";
          }
        }
      }

      newFriendActionBtn.disabled = false;
      hideLoading();
    });
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
  tabBtns.forEach((btn) => {
    // Clone to remove old event listeners and prevent duplicates
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);

    newBtn.addEventListener("click", () => {
      const tabName = newBtn.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("text-blue-600", "border-b-2", "border-blue-600");
        b.classList.add("text-gray-600", "hover:text-gray-900");
      });

      document.querySelectorAll(".tab-content").forEach((content) => {
        content.classList.remove("active");
        content.style.display = "none";
      });

      // Add active class to clicked button and corresponding content
      newBtn.classList.remove("text-gray-600", "hover:text-gray-900");
      newBtn.classList.add("text-blue-600", "border-b-2", "border-blue-600");

      const tabContent = document.getElementById(tabName + "-tab");
      if (tabContent) {
        tabContent.classList.add("active");
        tabContent.style.display = "block";
      }
    });
  });

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

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#friendActionBtn") && !e.target.closest("#friendsDropdown")) {
      friendsDropdown?.classList.add("hidden");
    }
  });
};
