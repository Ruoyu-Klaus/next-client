import React, {useState, useCallback, useRef} from 'react'
import PropTypes from 'prop-types'

// Waring, Function Components as Children muse be wrapped with React.forwardRef

InfiniteScrolling.propTypes = {
    children: PropTypes.node.isRequired,
    getPageNum: PropTypes.func.isRequired,
    pageStart: PropTypes.number,
    hasMore: PropTypes.bool,
    isLoading: PropTypes.bool,
}

function InfiniteScrolling(props) {
    const {getPageNum, pageStart, children, isLoading, hasMore = true} = props

    const [page, setPage] = useState(pageStart || 1)

    const observer = useRef()

    const lastChildRef = useCallback(
        (node) => {
            if (isLoading) return
            if (observer.current) observer.current.disconnect()
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    getPageNum(page + 1)
                    setPage((pre) => pre + 1)
                }
            })
            if (node) observer.current.observe(node)
        },
        [isLoading, hasMore],
    )

    return (
        <>
            {children.map((child, index) => {
                const isLastChild = children.length - 1 === index
                return isLastChild ? React.cloneElement(child, {ref: lastChildRef}) : child
            })}
        </>
    )
}

export default InfiniteScrolling
