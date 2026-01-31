// static/js/profile.js
window.profileManager = {
    currentUser: null,

    async init() {
        try {
            const response = await axios.get('/api/users/profile');
            
            // CHỖ CẦN SỬA: 
            // BE của bạn trả về: { code: 200, message: "...", data: { username: "abc", ... } }
            // Vậy phải lấy .data.data
            this.currentUser = response.data.data; 
            
            this.render(this.currentUser);
        } catch (error) {
            console.error("Load profile error:", error);
        }
    },

    render(user) {
        if (!user) return;

        // 1. Tên hiển thị (Kết hợp FirstName + LastName từ BE)
        const fullNameElem = document.getElementById('displayFullName');
        if (fullNameElem) {
            const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
            fullNameElem.innerText = fullName || user.username || "Unknown User";
        }

        // 2. Username (Phải hiện đúng @username)
        const usernameElem = document.getElementById('displayUsername');
        if (usernameElem) {
            usernameElem.innerText = user.username ? `@${user.username}` : "@username";
        }

        // 3. Hobby -> Đưa vào Bio (Đúng yêu cầu của bạn)
        const bioElem = document.getElementById('displayBio');
        if (bioElem) {
            bioElem.innerText = user.hobby || "Living life in glassmorphism. ✨";
        }

        // 4. Các thông tin khác (Lưu ý: BE trả về trường nào thì map đúng tên đó)
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.innerText = val || 0;
        };
        setVal('followingCount', user.followingCount);
        setVal('followersCount', user.followersCount);
        setVal('profilePostCount', user.postCount + " Posts");
        
        // 5. Avatar
        const avatarImg = document.getElementById('userAvatar');
        if (avatarImg) {
            avatarImg.src = user.avatarUrl || 'static/images/user.png';
        }
    }
};

profileManager.init();