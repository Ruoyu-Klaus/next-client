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

    const [ringWidth, ringHeight] = ringRef.current ? getDomWidthAndHeight(ringRef.current) : [0, 0]
    const [dotWidth, dotHeight] = dotRef.current ? getDomWidthAndHeight(dotRef.current) : [0, 0]

    const mouseDownHandler = () => {
        setIsActive(true)
    }

    const mouseUpHandler = () => {
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

    useEffect(() => {
        if (ringRef.current) {
            ringRef.current.style.transform = `translate(${x - ringWidth / 2}px, ${y - ringHeight / 2}px) scale(${isActive ? 1.5 : 1})`
        }
        if (dotRef.current) {
            dotRef.current.style.transform = `translate(${x - dotWidth / 2}px, ${y - dotHeight / 2}px)`
        }
    }, [x, y, isActive])

    return (
        <>
            <div ref={ringRef} className="ringContainer">
                <div className="ring" />
            </div>
            <div ref={dotRef} className={'dot ' + cursorType} />
        </>
    )
}

export default CustomCursor
