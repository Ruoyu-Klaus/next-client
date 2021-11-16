import { getArticleList } from '../request'
import emojiList from './emoji.json'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export class Blog {
  constructor(blog_path = 'posts') {
    this.blog_path = blog_path
  }
  findAllCategories() {
    return fs.readdirSync(path.join(`${this.blog_path}`))
  }
  getBlogFilesByCategory(category) {
    const fileNames = fs.readdirSync(path.join(`${this.blog_path}/${category}`))
    return fileNames.map(fileName => ({ fileName, category }))
  }
  getAllBlogFiles() {
    const categories = this.findAllCategories()
    return categories
      .map(category => this.getBlogFilesByCategory(category))
      .flat(1)
  }
  getPostByCategoryAndId(category, id) {
    try {
      const post = this.getBlogsByCategory(category).find(
        post => post.id === id
      )
      return post
    } catch (error) {
      return null
    }
  }

  getBlogsByCategory(category) {
    const files = this.getBlogFilesByCategory(category)
    const posts = files.map(({ fileName, category }) =>
      this.parseMDFile(fileName, category)
    )
    return posts
  }

  getAllBlogs() {
    const files = this.getAllBlogFiles()
    const posts = files.map(({ fileName, category }) =>
      this.parseMDFile(fileName, category)
    )
    return posts
  }

  getAllPostPaths(isLinkPath = false) {
    const posts = this.getAllBlogs()
    if (isLinkPath) {
      return posts.map(post => ({
        href: {
          pathname: `/blog/post/[cname]/[...slug]`,
          query: {
            cname: post.category,
            slug: [post.id],
          },
        },
        id: post.id,
        title: post.post_title,
        as: `/blog/post/${post.category}/${post.id}`,
      }))
    }
    return posts.map(post => ({
      params: {
        cname: encodeURIComponent(post.category),
        slug: [encodeURIComponent(post.id)],
      },
    }))
  }

  parseMDFile(fileName, category) {
    const slug = fileName.replace(/\.md$/, '')

    const markdownWithMeta = fs.readFileSync(
      path.join(`${this.blog_path}/${category}/${fileName}`),
      'utf-8'
    )
    const { data: frontMatter, content: post_content } =
      matter(markdownWithMeta)

    const {
      title: post_title,
      date: post_time,
      excerpt: post_introduce,
      cover = 'https://picsum.photos/400/500',
      tags = [],
    } = frontMatter

    const post_cover = cover
    const id = slug
    return {
      post_title,
      id,
      tags,
      post_content,
      post_time,
      post_cover,
      post_introduce,
      category,
    }
  }
}

export function randomEmoji() {
  const keys = Object.keys(emojiList)
  const randomIndex = Math.floor(Math.random() * keys.length)
  return emojiList[keys[randomIndex]]
}
