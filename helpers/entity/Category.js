import fs from 'fs'
import path from 'path'
import {isProduction} from '../env'

class Category {
    constructor(blog_path = 'posts') {
        this.blog_path = blog_path
        this.categories = []
        this.init()
    }
    init() {
        const categories = fs.readdirSync(path.join(`${this.blog_path}`))
        let index = categories.indexOf('draft')
        if (index !== -1 && isProduction) {
            categories.splice(index, 1)
        }
        this.categories = categories
    }
}
export default Category
