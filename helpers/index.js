import emojiList from './emoji.json'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dayjs from 'dayjs'
import _ from 'lodash'
import Category from './entity/Category'
import {Blog} from './entity/Blog'
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

export class BlogCollection {
    rootPath = ''
    categories = []
    tags = []
    blogs = []

    constructor(rootPath = 'posts') {
        if (BlogCollection._instance) {
            return BlogCollection._instance
        }
        BlogCollection._instance = this
        this.rootPath = rootPath
        this.categories = new Category(rootPath).categories
        this.blogs = this.getBlogsSortedByDate(rootPath).map((blog) => new Blog(blog))
        this.tags = this.getTagsWithWeight()
    }

    getBlogsByCategory(category) {
        const blogs = this.blogs.filter((blog) => blog.category === category)
        return serializeContent(blogs)
    }

    getBlogByCategoryAndId(category, id) {
        const blog = this.getBlogsByCategory(category).find((post) => post.id === id)
        return serializeContent(parseMarkdownContent(blog))
    }

    getBlogFilesByCategory(category) {
        let dirPath = `${this.rootPath}/${category}`
        const fileNames = fs.readdirSync(path.join(dirPath))
        return fileNames.filter((fileName) => fileName.includes('.md')).map((f) => ({fileName: f, category}))
    }

    getAllBlogFileNamesWithCategory() {
        return this.categories.map((category) => this.getBlogFilesByCategory(category)).flat(1)
    }

    getBlogsSortedByDate() {
        return this.getAllBlogFileNamesWithCategory()
            .map(({fileName, category}) => this.parseFrontMatter(fileName, category))
            .sort((a, b) => {
                return dayjs(a.date).isBefore(dayjs(b.date)) ? 1 : -1
            })
    }

    getAllPostPaths(isLinkPath = false) {
        if (isLinkPath) {
            return this.blogs.map((post) => ({
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
        return this.blogs.map((post) => ({
            params: {
                cname: post.category,
                slug: [post.id],
            },
        }))
    }

    getTagsWithWeight() {
        const tags = _.map(this.blogs, 'tags').flat(1)
        return _.values(_.groupBy(tags)).map((tag) => ({
            text: tag[0],
            value: tag.length,
        }))
    }

    parseFrontMatter(fileName, category) {
        const slug = fileName.replace(/\.md$/, '')
        const markdownWithMeta = fs.readFileSync(path.join(`${this.rootPath}/${category}/${fileName}`), 'utf-8')
        const {data: frontMatter, content} = matter(markdownWithMeta)
        const {title, date, excerpt, cover = '../cover_placeholder.png', tags = []} = frontMatter
        const coverImage = cover
        return {
            id: slug,
            title,
            date,
            excerpt,
            content,
            coverImage,
            category,
            tags,
        }
    }
}

const parseMarkdownContent = (blog) => {
    const {parsedContent, tocTree} = getParsedContentWithTocTree(blog.content)
    return {...blog, content: parsedContent, tocTree}
}

export const serializeContent = (content) => {
    try {
        return JSON.parse(JSON.stringify(content))
    } catch (error) {
        throw new Error(error)
    }
}

export function randomEmoji() {
    const keys = Object.keys(emojiList)
    const randomIndex = Math.floor(Math.random() * keys.length)
    return emojiList[keys[randomIndex]]
}
