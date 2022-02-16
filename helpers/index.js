import emojiList from './emoji.json'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import dayjs from 'dayjs'
import _, {cloneDeep} from 'lodash'
import Category from './entity/Category'
import {Blog} from './entity/Blog'
import {getParsedContentWithTocTree} from './markDownRenderer'

export class BlogCollection {
    tags = []
    constructor(blog_path = 'posts') {
        this.blog_path = blog_path
        this.categories = new Category(blog_path).categories
        this.blogs = this.getAllBlogs().map((blog) => new Blog(blog))
        this.tags = this.getTagsWithWeight()
        // this.initCache();
    }

    getBlogsByCategory(category) {
        const blogs = this.blogs.filter((blog) => blog.category === category)
        return serializeContent(blogs)
    }

    getBlogByCategoryAndId(category, id) {
        const blog = this.getBlogsByCategory(category).find((post) => post.id === id)
        return serializeContent(parseBlogMarkdownContent(blog))
    }

    getBlogFilesByCategory(category) {
        const fileNames = fs.readdirSync(path.join(`${this.blog_path}/${category}`))
        return fileNames.map((fileName) => ({fileName, category}))
    }

    getAllBlogFileNamesWithCategory() {
        const categories = this.categories
        return categories.map((category) => this.getBlogFilesByCategory(category)).flat(1)
    }

    getAllBlogs() {
        return this.getAllBlogFileNamesWithCategory()
            .map(({fileName, category}) => this.parseMarkDown(fileName, category))
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

    parseMarkDown(fileName, category) {
        const slug = fileName.replace(/\.md$/, '')
        const markdownWithMeta = fs.readFileSync(path.join(`${this.blog_path}/${category}/${fileName}`), 'utf-8')
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
    // initCache() {
    //   try {
    //     fs.readdirSync("_cachePosts");
    //   } catch (error) {
    //     fs.mkdirSync("_cachePosts");
    //   }

    // fs.writeFile(
    //   "_cachePosts/blogs.json",
    //   JSON.stringify(this.blogs),
    //   function (err) {
    //     if (err) return console.error(err);
    //   }
    // );
    // fs.writeFile(
    //   "_cachePosts/tags.json",
    //   JSON.stringify(this.tags),
    //   function (err) {
    //     if (err) return console.error(err);
    //   }
    // );
    // }
}

const parseBlogMarkdownContent = (blog) => {
    const {parsedContent, tocTree} = getParsedContentWithTocTree(blog.content)
    blog.content = parsedContent
    blog.tocTree = tocTree
    return blog
}

export const serializeContent = (content) => {
    try {
        return JSON.parse(JSON.stringify(content))
    } catch (error) {
        throw new Error(error)
    }
}

export const filterPost = (posts, query) => {
    if (!query) return posts
    const _query = query.toLowerCase()
    return posts.filter((post) => {
        return (
            post.title.toLowerCase().includes(_query) ||
            post.tags.join(' ').toLowerCase().includes(_query) ||
            post.excerpt.toLowerCase().includes(_query) ||
            post.categories
                .map((category) => category.name)
                .join(' ')
                .toLowerCase()
                .includes(_query)
        )
    })
}

export const getFilteredData = (posts, enableSearch, query) => {
    const _posts = cloneDeep(posts)
    if (enableSearch && !query) {
        return []
    }
    return filterPost(_posts, query)
}

export function randomEmoji() {
    const keys = Object.keys(emojiList)
    const randomIndex = Math.floor(Math.random() * keys.length)
    return emojiList[keys[randomIndex]]
}
