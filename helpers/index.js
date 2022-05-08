import emojiList from './emoji.json'
import {getParsedContentWithTocTree} from './markDownRenderer'
import blogCollection from '../_posts/blogCollection.json'

export const getAllBlogs = () => {
    const blogs = []
    const recursion = (arr) => {
        arr.forEach((item) => {
            if (item.id) {
                blogs.push(parseMarkdownContent(item))
            } else {
                const category = Object.keys(item)[0]
                recursion(item[category])
            }
        })
    }
    recursion(blogCollection)
    return blogs
}

export const getAllPostPaths = (blogs, isLinkPath = false) => {
    if (isLinkPath) {
        return blogs.map((post) => ({
            href: {
                pathname: `/blog/post/[cname]/[...slug]`,
                query: {
                    cname: post.category,
                    slug: [post.id],
                },
            },
            id: post.id,
            title: post.title,
            as: `/blog/post/${post.category}/${post.id}`,
        }))
    }
    return blogs.map((post) => ({
        params: {
            cname: post.category,
            slug: [post.id],
        },
    }))
}

const parseMarkdownContent = (blog) => {
    const {parsedContent, tocTree} = getParsedContentWithTocTree(blog.content)
    return {...blog, content: parsedContent, tocTree}
}

export function randomEmoji() {
    const keys = Object.keys(emojiList)
    const randomIndex = Math.floor(Math.random() * keys.length)
    return emojiList[keys[randomIndex]]
}
