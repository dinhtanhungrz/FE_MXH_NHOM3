import { Layout } from "../../components/Layout.js";
import { getMyFriends } from "../../../services/friendService.js";
import { renderUserLink, renderEmpty } from "../../viewHelpers.js";

let page = 0;
let last = false;
let loading = false;

export async function FriendsListPage() {
  page = 0;
  last = false;
  loading = false;

  setTimeout(init, 0);

  const content = `
    <div class="max-w-6xl mx-auto">

      <h1 class="text-2xl font-bold mb-6 text-center">
        Danh sách bạn bè
      </h1>

      <div id="friendsList" class="grid grid-cols-2 gap-4 justify-center"></div>

      <div id="loading" class="hidden text-center py-4">
        Loading...
      </div>

    </div>
  `;

  return Layout(content);
}

async function init() {
  await load();
}

async function load() {
  if (loading || last) return;

  loading = true;

  try {
    const res = await getMyFriends(page);

    const pageData = res.data;

    if (!pageData) {
      console.error("API response invalid", res);
      return;
    }

    render(pageData.content);

    last = pageData.last;

    page++;
  } catch (err) {
    console.error("Load friends error:", err);
  }

  loading = false;
}

function render(users) {
  const container = document.getElementById("friendsList");
  if (!container) return;

  if (!users || users.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 flex flex-col items-center justify-center py-16">
        ${renderEmpty("Bạn chưa có bạn bè nào")}
      </div>
    `;
    return;
  }

  users.forEach((u) => {
    const avatar = u.avatarUrl || `https://ui-avatars.com/api/?name=${u.username}`;

    const mutualFriendsCount = u.mutualFriendsCount || 0;

    container.insertAdjacentHTML(
      "beforeend",
      `

      <div class="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden">

        <div class="p-4 flex items-center gap-3">

          <img src="${avatar}" 
          class="w-16 h-16 rounded-full object-cover flex-shrink-0"/>

          <div class="flex-1 min-w-0">
            ${renderUserLink(u, "text-base")}
            
            <div class="mt-1 text-gray-600 text-xs">
              <p><span class="font-semibold text-gray-800">${mutualFriendsCount}</span> bạn chung</p>
            </div>
          </div>

        </div>

      </div>

    `,
    );
  });
}
