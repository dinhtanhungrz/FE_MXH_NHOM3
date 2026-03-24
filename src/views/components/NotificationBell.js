
export const NotificationBell = () => {
    const notifyBell = `
        <div class="relative flex items-center">

            <!-- 🔔 BUTTON -->
            <button id="notificationBtn" class="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition" title="Thông báo">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span id="notificationBadge"
                    class="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full hidden">
                </span>
            </button>

            <!-- 🔽 DROPDOWN -->
            <div id="notificationDropdown"
                class="hidden absolute right-0 top-8 mt-2 w-96 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border">

                <!-- HEADER -->
                <div class="flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-10">
                    <div class="flex items-center gap-2">
                        <h3 class="font-bold text-gray-900 text-lg">Thông báo</h3>
                        <span id="popupUnreadCount" class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full hidden">0 mới</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <button id="markAllReadBtn" class="text-sm text-blue-500 hover:text-blue-700 font-medium transition" title="Đánh dấu tất cả đã đọc">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </button>
                        <button id="closeNotificationBtn" class="text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-200 p-1.5 rounded-full transition" title="Đóng">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- LIST -->
                <div id="notificationList" class="max-h-[400px] overflow-y-auto divide-y">

                    <!-- loading / empty sẽ render bằng JS -->

                </div>

                <!-- FOOTER -->
                <div class="text-center py-3 border-t bg-gray-50">
                    <button id="viewAllNotifications" class="text-blue-500 hover:underline text-sm font-medium">
                        Xem tất cả thông báo
                    </button>
                </div>

            </div>
        </div>
    `;

    return notifyBell;
};