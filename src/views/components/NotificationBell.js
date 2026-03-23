export const NotificationBell = () => {
return `
<div class="relative">

    <!-- 🔔 BUTTON -->
    <button id="notificationBtn" class="relative p-2 hover:bg-gray-200 rounded-full text-xl transition">
        🔔
        <span id="notificationBadge"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full hidden">
        </span>
    </button>

    <!-- 🔽 DROPDOWN -->
    <div id="notificationDropdown"
        class="hidden absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-xl z-50 overflow-hidden border">

        <!-- HEADER -->
        <div class="flex justify-between items-center px-4 py-3 border-b bg-white sticky top-0 z-10">
            <h3 class="font-bold text-gray-900 text-lg">Thông báo</h3>
            <button id="markAllReadBtn" class="text-sm text-blue-500 hover:underline">
                Đánh dấu tất cả
            </button>
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
};