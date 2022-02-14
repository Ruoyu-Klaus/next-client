import React, {useEffect, useState, useRef, useContext} from 'react'
import useMousePosition from '../hooks/useMousePosition'
import {CursorContext} from '../context/cursor/CursorContext'
import {isMobile} from 'react-device-detect'

const getDomWidthAndHeight = (dom) => {
    return [dom.offsetWidth, dom.offsetHeight]
}

function CustomCursor() {
    if (isMobile) {
        return null
    }
    const {x, y} = useMousePosition()
    const ringRef = useRef()
    const dotRef = useRef()

    const {cursorType} = useContext(CursorContext)
    const [isActive, setIsActive] = useState(false)

    let ringWidth
    let ringHeight
    let dotWidth
    let dotHeight
    ;[ringWidth, ringHeight] = ringRef.current
        ? getDomWidthAndHeight(ringRef.current)
        : ([0, 0][(dotWidth, dotHeight)] = dotRef.current ? getDomWidthAndHeight(dotRef.current) : [0, 0])

    const mouseDownHandler = (e) => {
        setIsActive(true)
    }

    const mouseUpHandler = (e) => {
        setIsActive(false)
    }

    useEffect(() => {
        document.addEventListener('mousedown', mouseDownHandler)
        document.addEventListener('mouseup', mouseUpHandler)
        return () => {
            document.removeEventListener('mousedown', mouseDownHandler)
            document.removeEventListener('mouseup', mouseUpHandler)
        }
    }, [])
    return (
        <>
            <div
                ref={ringRef}
                style={{
                    transform: `translate(${x - ringWidth / 2}px, ${y - ringHeight / 2}px) scale(${isActive ? 1.5 : 1})`,
                }}
                className="ringContainer"
            >
                <div className="ring" />
            </div>
            <div
                ref={dotRef}
                style={{
                    transform: `translate(${x - dotWidth / 2}px, ${y - dotHeight / 2}px)`,
                }}
                className={'dot ' + cursorType}
            />
        </>
    )
}

export default CustomCursor
