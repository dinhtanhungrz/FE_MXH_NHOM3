import { getCommonFriends } from "../../../services/friendService.js";
import { renderUserLink } from "../../viewHelpers.js";
let page = 0;
let loading = false;
let last = false;
let userId = null;

  // Fix: get userId from hash for hash router (e.g. #/friends/2)
  export async function MutualFriendsPage(params) {

  userId = params.id;

  page = 0;
  loading = false;
  last = false;

  setTimeout(init,0);
  
    

  // Render initial HTML

  return `
    <div class="max-w-4xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Bạn bè</h1>

      <div id="mutualList" class="grid grid-cols-2 gap-4"></div>

      <div id="loading" class="text-center py-4 hidden">
        Loading...
      </div>
    </div>
  `;
}

async function init() {

  const container = document.getElementById("mutualList");
if (container) {
    container.addEventListener("click", (e) => {
      const link = e.target.closest(".user-link");
      if (!link) return;

      const id = link.dataset.userId;
      if (!id) return;

      window.location.hash = `#/user-profile/${id}`;
    });
  }
  
  await load();

  window.addEventListener("scroll", async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
      await load();
    }
  });
}
  
async function load() {
  if (loading || last) return;

  loading = true;
  document.getElementById("loading").classList.remove("hidden");

  const res = await getCommonFriends(userId, page);

const data = res.data; // lấy data từ axios
  render(data.content);

  last = data.last;
  page++;

  loading = false;
  document.getElementById("loading").classList.add("hidden");
}

function render(users) {
  const container = document.getElementById("mutualList");
  if (!container) return;
  users.forEach(u => {
    const avatar = u.avatarUrl || u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.username || "User")}&size=80&background=3b82f6&color=fff`;
    container.insertAdjacentHTML("beforeend", `
      <div class="flex items-center gap-3 p-3 bg-white rounded-xl shadow">
        <img src="${avatar}" class="w-12 h-12 rounded-full object-cover"/>
        <div>
          <p>${renderUserLink(u)}</p>
          <p class="text-sm text-gray-500">${u.mutualCount || 0} bạn chung</p>
        </div>
      </div>
    `);
  });
}