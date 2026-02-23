import { postController } from '../../controllers/postController'

export function PostForm({ post = null, onSuccess }) {
  const form = document.createElement('form')

  form.innerHTML = `
    <textarea placeholder="Bạn đang nghĩ gì?" required>
${post ? post.content : ''}
    </textarea>
    <button type="submit">
      ${post ? 'Cập nhật' : 'Đăng bài'}
    </button>
  `

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const content = form.querySelector('textarea').value.trim()
    if (!content) return

    let result
    if (post) {
      result = await postController.updatePost(post.id, { content })
    } else {
      result = await postController.createPost({ content })
      form.reset()
    }

    onSuccess?.(result)
  })

  return form
}