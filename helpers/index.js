import emojiList from './emoji.json'
import _ from 'lodash'

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
    const _posts = _.cloneDeep(posts)
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
