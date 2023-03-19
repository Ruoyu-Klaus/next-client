import React from 'react'
import {FixedSizeGrid} from 'react-window'
import {useMediaQuery} from '@chakra-ui/react'
import AutoSizer from 'react-virtualized-auto-sizer'
import PostCardItem from './PostCardItem'

function PostCardGridList({posts}) {
    const [isSmallerThan780, isSmallerThan1280] = useMediaQuery(['(max-width: 780px)', '(max-width: 1280px)'])
    const grid = {
        cols: 0,
    }

    if (isSmallerThan780) {
        grid.cols = 1
    } else if (isSmallerThan1280) {
        grid.cols = 2
    } else {
        grid.cols = 3
    }

    const matrixData = posts.reduce((rows, post, index) => {
        return (index % grid.cols === 0 ? rows.push([post]) : rows[rows.length - 1].push(post)) && rows
    }, [])

    return (
        <AutoSizer style={{display: 'flex', width: '100%', height: '480px', justifyContent: 'center'}}>
            {({height, width}) => {
                return (
                    <FixedSizeGrid
                        columnCount={grid.cols}
                        rowCount={matrixData.length}
                        columnWidth={width > 1920 ? 1920 / grid.cols : width / grid.cols}
                        rowHeight={490}
                        width={width > 1920 ? 1920 : width}
                        height={height - 380}
                        itemData={matrixData}
                    >
                        {PostCardItem}
                    </FixedSizeGrid>
                )
            }}
        </AutoSizer>
    )
}

export default PostCardGridList
