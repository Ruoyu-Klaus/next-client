import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import cloneDeep from 'lodash/cloneDeep'

useSearchPost.propTypes = {
    pageNum: PropTypes.number,
    limit: PropTypes.number,
    enableSearch: PropTypes.bool,
    originalPosts: PropTypes.array,
}

const filterPost = (posts, query) => {
    if (!query) return []
    const _query = query.toLowerCase()
    return cloneDeep(posts).filter((post) => {
        return (
            post.title?.toLowerCase().includes(_query) ||
            (post.tags && post.tags.join(' ').toLowerCase().includes(_query)) ||
            post.excerpt?.toLowerCase().includes(_query) ||
            post.category?.toLowerCase().includes(_query)
        )
    })
}

function useSearchPost(props) {
    const {originalPosts = []} = props
    const [posts, setPosts] = useState([])
    const [query, setSearchValue] = useState('')

    const getPosts = useCallback(() => {
        const filteredPosts = filterPost(originalPosts, query)
        if (filteredPosts.length === 0) {
            return
        }
        setPosts((pre) => [...pre, ...filteredPosts])
    }, [originalPosts, query])

    const clearDataOnQueryChange = () => {
        setPosts([])
    }

    useEffect(clearDataOnQueryChange, [query, originalPosts])

    useEffect(() => {
        getPosts()
    }, [originalPosts, query])

    return {posts, setSearchValue}
}

export default useSearchPost
