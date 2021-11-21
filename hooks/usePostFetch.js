import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep } from 'lodash'
import PropTypes from 'prop-types'

usePostFetch.propTypes = {
  pageNum: PropTypes.number,
  limit: PropTypes.number,
  query: PropTypes.string,
  initialLoad: PropTypes.bool,
  clientSidePagination: PropTypes.bool,
  originalPosts: PropTypes.object,
}

function usePostFetch(props) {
  const {
    pageNum = 1,
    limit = 6,
    query = '',
    clientSidePagination = false,
    originalPosts = [],
  } = props

  const [hasMore, setHasmore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  // used for local search
  function getCountAndRows(query) {
    if (query === null) return { count: 0, rows: {} }
    // const copyPosts = cloneDeep(originalPosts)
    const copyPosts = query
      ? originalPosts.filter(post => post.title.toLowerCase().includes(query))
      : cloneDeep(originalPosts)
    let count = copyPosts.length
    let rows = copyPosts
    return { count, rows }
  }

  const getDataFromLocal = useCallback(() => {
    let { count, rows } = getCountAndRows(query)
    const maxPages = count / limit
    if (!rows || !rows.length) return
    if (pageNum >= maxPages) {
      setHasmore(false)
    }
    let data = rows.splice((pageNum - 1) * (limit * (pageNum - 1)), limit)

    setPosts(pre => [...new Set([...pre, ...data])])
  }, [pageNum, limit, originalPosts, query])

  useEffect(() => {
    getDataFromLocal()
  }, [pageNum, query])

  useEffect(() => {
    if (clientSidePagination) {
      setPosts([])
      getDataFromLocal()
    }
  }, [originalPosts, query, clientSidePagination])

  return {
    isLoading,
    posts,
    hasMore,
  }
}

export default usePostFetch
