import * as friendService from "../services/friendService.js";

const friendController = {
  async getSuggestions() {
    try {
      const response = await friendService.getFriendSuggestions();
      // Giả sử API trả về mảng user hoặc object có field content
      return response.data?.content || response.data || [];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  },

  async handleAddFriend(userId, buttonElement) {
    try {
      buttonElement.disabled = true;
      buttonElement.innerText = "Đang gửi...";
      await friendService.sendFriendRequest(userId);
      
      buttonElement.innerText = "Đã gửi lời mời";
      buttonElement.className = "px-3 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg cursor-not-allowed";
    } catch (error) {
      alert("Không thể gửi lời mời kết bạn");
      buttonElement.disabled = false;
      buttonElement.innerText = "Kết bạn";
    }
  }
};

export default friendController;