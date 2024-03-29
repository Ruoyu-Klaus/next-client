const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const _ = require('lodash')

class Category {
    constructor(blog_path = 'posts') {
        this.blog_path = blog_path
        this.categories = []
        this.init()
    }

    init() {
        const categories = fs.readdirSync(path.join(`${this.blog_path}`)).filter((dir) => !/(^|\/)\.[^\/\.]/g.test(dir))
        let index = categories.indexOf('draft')
        if (index !== -1 && process.env.NODE_ENV === 'production') {
            categories.splice(index, 1)
        }
        this.categories = categories
    }
}

class BlogCollection {
    rootPath = ''
    categories = []
    _tags = []
    blogsTree = []
    tagWithCount = []
    imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.glf', '.gif']

    constructor(rootPath = 'posts') {
        if (BlogCollection._instance) {
            return BlogCollection._instance
        }
        BlogCollection._instance = this
        this.rootPath = rootPath
        this.categories = new Category(rootPath).categories
        this.blogsTree = this.getBlogsTree()
        this.tagWithCount = this.countTags(this._tags.flat(1))
    }

    getBlogsTree() {
        return this.categories.map((category) => {
            let dirPath = `${this.rootPath}/${category}`
            const recursion = (subTree, absPath) => {
                const fileNames = fs.readdirSync(path.join(absPath)).filter((dir) => !/(^|\/)\.[^\/\.]/g.test(dir))

                fileNames.forEach((fileName) => {
                    if (fileName.includes('.md')) {
                        subTree.push({...this.parsedFrontMatter(fileName, absPath), category})
                    } else if (this.imageExtensions.includes(path.extname(fileName).toLowerCase())) {
                        fs.access(`public/images/${fileName}`, fs.constants.F_OK, (err) => {
                            if (err) {
                                fs.copyFile(`${absPath}/${fileName}`, `public/images/${fileName}`, fs.constants.COPYFILE_EXCL, (err) => {
                                    console.error('copy image error ' + err)
                                })
                            }
                        })
                    } else {
                        dirPath = `${absPath}/${fileName}`
                        subTree.push({[fileName]: recursion([], dirPath)})
                    }
                })
                return subTree
            }
            return {[category]: recursion([], dirPath)}
        })
    }

    parsedFrontMatter(fileName, dirPath) {
        try {
            const slug = fileName.replace(/\.md$/, '')
            const markdownWithMeta = fs.readFileSync(path.join(`${dirPath}/${fileName}`), 'utf-8')
            const {data: frontMatter, content} = matter(markdownWithMeta)
            frontMatter.tags && this._tags.push(frontMatter.tags)
            return {
                id: frontMatter.slug || slug,
                content,
                dirPath,
                coverImage: this.getCoverImagePath(frontMatter.cover),
                ...frontMatter,
            }
        } catch (e) {
            console.log(e)
        }
    }

    countTags(tags) {
        return _.values(_.groupBy(tags)).map((tag) => ({
            text: tag[0],
            value: tag.length,
        }))
    }

    getCoverImagePath(cover) {
        if (!cover) return '/cover_placeholder.png'
        const isNetworkURL = (str) => str.match(/^http.+/)
        if (isNetworkURL(cover)) return cover
        const markdownImageFormat = cover.match(/\(([^)]+)\)/)
        if (markdownImageFormat) {
            return `/images/${markdownImageFormat[1]}`
        }
        return `/images${cover}`
    }
}

const blogCollection = new BlogCollection()
try {
    fs.readdirSync('_posts')
} catch (error) {
    fs.mkdirSync('_posts')
}
fs.writeFileSync('_posts/categories.json', JSON.stringify(blogCollection.categories), (err) => {
    console.log(err)
})
fs.writeFileSync('_posts/blogCollection.json', JSON.stringify(blogCollection.blogsTree), (err) => {
    console.log(err)
})
fs.writeFileSync('_posts/tags.json', JSON.stringify(blogCollection.tagWithCount), (err) => {
    console.log(err)
})
