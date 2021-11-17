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
    originalPosts = null,
  } = props

  const [hasMore, setHasmore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  // used for local search
  function getCountAndRows() {
    const copyPosts = cloneDeep(originalPosts)
    let count = copyPosts.count,
      rows = copyPosts.rows
    if (!count) {
      count = copyPosts.length
    }
    if (!rows) {
      rows = copyPosts
    }
    return { count, rows }
  }

  const getDataFromLocal = useCallback(() => {
    let { count, rows } = getCountAndRows()
    const maxPages = count / limit
    if (!rows || !rows.length) return
    if (pageNum >= maxPages) {
      setHasmore(false)
    }
    let data = rows.splice((pageNum - 1) * (limit * (pageNum - 1)), limit)

    setPosts(pre => [...new Set([...pre, ...data])])
  }, [pageNum, limit, originalPosts])

  useEffect(() => {
    getDataFromLocal()
  }, [pageNum])

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
