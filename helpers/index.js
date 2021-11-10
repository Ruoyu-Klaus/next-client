import { getArticleList } from '../request'
import emojiList from './emoji.json'

export async function getPostPaths(linkPath = false) {
  const posts = await getArticleList()
  const rows = posts.rows ? posts.rows : posts
  if (linkPath) {
    return rows.map(post => ({
      href: {
        pathname: `/blog/post/[cname]/[...slug]`,
        query: {
          cname: post.category.category_name,
          slug: [post.id, post.post_title],
        },
      },
      id: post.id,
      title: post.post_title,
      as: `/blog/post/${post.category.category_name}/${post.id}/${post.post_title}`,
    }))
  }

  return rows.map(post => ({
    params: {
      cname: encodeURIComponent(post.category.category_name),
      slug: [encodeURIComponent(post.id), encodeURIComponent(post.post_title)],
    },
  }))
}

export function randomEmoji() {
  const keys = Object.keys(emojiList)
  const randomIndex = Math.floor(Math.random() * keys.length)
  return emojiList[keys[randomIndex]]
}
