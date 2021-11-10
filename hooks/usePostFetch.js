import { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { getArticleList } from '../request'
import { cloneDeep } from 'lodash'
import PropTypes from 'prop-types'
import axios from 'axios'

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
    initialLoad = true,
    clientSidePagination = false,
    originalPosts = null,
  } = props

  const [hasMore, setHasmore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [posts, setPosts] = useState([])

  const _initialLoad = useRef(initialLoad)

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
    let data = rows.splice((pageNum - 1) * (limit * pageNum), limit)
    setPosts(pre => [...new Set([...pre, ...data])])
  }, [pageNum, limit, originalPosts])

  useEffect(() => {
    if (clientSidePagination) {
      setPosts([])
      getDataFromLocal()
    }
  }, [originalPosts, query, clientSidePagination])

  // used for server side search
  useEffect(() => {
    if (clientSidePagination) return () => {}
    if (!_initialLoad.current) {
      _initialLoad.current = true
      return () => {}
    }
    const searchRequest = axios.CancelToken.source()
    const cancelToken = searchRequest.token
    const fetchPosts = async () => {
      try {
        setIsLoading(true)
        const { count, rows } = await getArticleList({
          query,
          pageNum,
          limit,
          cancelToken,
        })
        const left = count - limit * pageNum
        // console.log({ count, left, pageNum, limit });
        left <= 0 && setHasmore(false)
        setPosts(pre => [...new Set([...pre, ...rows])])
        setIsLoading(false)
      } catch (error) {
        setIsLoading(true)
      }
    }

    fetchPosts()

    return () => searchRequest.cancel()
  }, [clientSidePagination, query, pageNum, limit, initialLoad])

  return {
    isLoading,
    posts,
    hasMore,
  }
}

export default usePostFetch
