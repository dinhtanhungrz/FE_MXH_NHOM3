import { Layout } from "../../components/Layout.js";
import { getMyFriends } from "../../../services/friendService.js";
import { renderUserLink } from "../../viewHelpers.js";

let page = 0;
let last = false;
let loading = false;

export async function FriendsListPage() {

  page = 0;
  last = false;
  loading = false;

  setTimeout(init,0);

  const content = `
    <div class="max-w-3xl mx-auto">

      <h1 class="text-2xl font-bold mb-6">
        Danh sách bạn bè
      </h1>

      <div id="friendsList" class="space-y-3"></div>

      <div id="loading" class="hidden text-center py-4">
        Loading...
      </div>

    </div>
  `;

  return Layout(content);
}

async function init(){
  await load();
}

async function load(){

  if(loading || last) return;

  loading = true;

  try {

    const res = await getMyFriends(page);

    const pageData = res.data;

    if(!pageData){
      console.error("API response invalid", res);
      return;
    }

    render(pageData.content);

    last = pageData.last;

    page++;

  } catch(err){
    console.error("Load friends error:", err);
  }

  loading = false;
}

function render(users){

  const container = document.getElementById("friendsList");
  if(!container) return;

  users.forEach(u => {

    const avatar = u.avatarUrl ||
      `https://ui-avatars.com/api/?name=${u.username}`;

    container.insertAdjacentHTML("beforeend",`

      <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md transition">

        <img src="${avatar}" 
        class="w-12 h-12 rounded-full object-cover"/>

        <div class="flex-1">
          ${renderUserLink(u)}
        </div>

      </div>

    `);

  });

}