import { postController } from '../../controllers/postController'

export function PostItem(post, onRefresh) {
  const div = document.createElement('div')
  div.className = 'post-item'

  div.innerHTML = `
    <p>${post.content}</p>
    <small>${new Date(post.createdAt).toLocaleString()}</small>
    <div>
      <button class="edit">Sửa</button>
      <button class="delete">Xóa</button>
    </div>
  `

  div.querySelector('.delete').onclick = async () => {
    if (!confirm('Xóa bài viết?')) return
    await postController.deletePost(post.id)
    onRefresh()
  }

  div.querySelector('.edit').onclick = () => {
    const editForm = PostForm({
      post,
      onSuccess: () => onRefresh()
    })
    div.replaceWith(editForm)
  }

  return div
}