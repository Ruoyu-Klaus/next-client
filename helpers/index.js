import {getParsedContentWithTocTree} from './markDownRenderer'
import blogCollection from '../_posts/blogCollection.json'
import dayjs from 'dayjs'

export const getAllBlogsList = () => {
    const blogs = []
    const recursion = (arr) => {
        arr.forEach((item) => {
            if (item.id) {
                const _item = {}
                Object.assign(_item, item)
                _item.content = null
                blogs.push(_item)
            } else {
                const category = Object.keys(item)[0]
                recursion(item[category])
            }
        })
    }
    recursion([...blogCollection])
    blogs.sort((a, b) => {
        return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
    })
    return blogs
}
export const getBlogDetailById = (id) => {
    const blogs = [...blogCollection]
    let blog
    const recursion = (arr) => {
        arr.forEach((item) => {
            if (blog) return
            if (item.id) {
                if (item.id === id) {
                    blog = Object.assign({}, item)
                }
            } else {
                const category = Object.keys(item)[0]
                recursion(item[category])
            }
        })
    }
    recursion([...blogs])
    return parseMarkdownContent(blog)
}

export const getAllPostPaths = (isLinkPath = false) => {
    const blogs = getAllBlogsList()
    if (isLinkPath) {
        return blogs.map((post) => ({
            href: {
                pathname: `/blog/detail/[id]`,
                query: {
                    id: post.id,
                },
            },
            id: post.id,
            title: post.title,
            as: `/blog/detail/${post.id}`,
        }))
    }
    return blogs.map((post) => ({
        params: {
            id: post.id,
        },
    }))
}

const parseMarkdownContent = (blog) => {
    const {parsedContent, tocTree} = getParsedContentWithTocTree(blog.content)
    return {...blog, content: parsedContent, tocTree}
}

export const pageCount = (number, show_per_page) => {
    return Math.ceil(number / show_per_page)
}
