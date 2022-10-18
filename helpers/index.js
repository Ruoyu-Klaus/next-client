import {getParsedContentWithTocTree} from './markDownRenderer'
import blogCollection from '../_posts/blogCollection.json'
import dayjs from 'dayjs'

export const getAllBlogsList = () => {
    const blogs = []
    const recursion = (arr) => {
        arr.forEach((item) => {
            if (item.id) {
                const _item = {};
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
export const getBlogDetailByCategoryAndId = (category, id) => {
    const category_blogs = [...blogCollection].find(blog => Object.keys(blog)[0] === category)
    if (!category_blogs) {
        return null
    }
    const blogs = category_blogs[category]
    let blog
    const recursion = (arr) => {
        arr.forEach(item => {
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
    const blogs = getAllBlogsList();
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
