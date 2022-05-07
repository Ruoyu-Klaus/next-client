import React, {useContext, useEffect, useRef, useState} from 'react'
import useMousePosition from '../hooks/useMousePosition'
import {CursorContext} from '../context/cursor/CursorContext'
import {isMobile} from 'react-device-detect'

const getElementWidthAndHeight = (element) => {
    return [element.offsetWidth, element.offsetHeight]
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

    const [ringWidth, ringHeight] = ringRef.current ? getElementWidthAndHeight(ringRef.current) : [0, 0]
    const [dotWidth, dotHeight] = dotRef.current ? getElementWidthAndHeight(dotRef.current) : [0, 0]

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
