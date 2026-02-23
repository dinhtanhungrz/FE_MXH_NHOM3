import { PostItem } from './PostItem'

export function PostList(posts, onRefresh) {
  const container = document.createElement('div')

  posts.forEach(post => {
    container.appendChild(PostItem(post, onRefresh))
  })

  return container
}