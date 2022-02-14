import {useCallback, useEffect, useState} from 'react'
import PropTypes from 'prop-types'
import {getFilteredData} from '../helpers'

usePaginationPost.propTypes = {
    pageNum: PropTypes.number,
    limit: PropTypes.number,
    enableSearch: PropTypes.bool,
    originalPosts: PropTypes.array,
}

function usePaginationPost(props) {
    const {pageNum = 1, limit = 6, enableSearch = false, originalPosts = []} = props

    const [hasMore, setHasMore] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [posts, setPosts] = useState([])
    const [query, changeSearchValue] = useState('')

    const calculatePagination = (filteredPosts) => {
        const count = filteredPosts.length
        const maxPages = count / limit
        if (pageNum >= maxPages) {
            setHasMore(false)
        }
        return filteredPosts.splice((pageNum - 1) * (limit * (pageNum - 1)), limit)
    }

    const getPostsByPage = useCallback(() => {
        const filteredPosts = getFilteredData(originalPosts, enableSearch, query)
        if (filteredPosts.length === 0) {
            return
        }
        const data = calculatePagination(filteredPosts)
        setPosts((pre) => [...pre, ...data])
    }, [pageNum, originalPosts, query, enableSearch])

    const clearDataOnQueryChange = () => {
        setPosts([])
        setHasMore(true)
        setIsLoading(false)
    }

    useEffect(clearDataOnQueryChange, [query])

    useEffect(() => {
        getPostsByPage()
    }, [pageNum, query])

    return {posts, isLoading, hasMore, changeSearchValue}
}

export default usePaginationPost
