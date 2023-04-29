import React, {useState} from 'react'
import {useRouter} from 'next/router'
import {HStack, Text, Button} from '@chakra-ui/react'
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'

const displayPageCount = 3

function Pagination({totalPageCount}) {
    let router = useRouter()
    let _currentPage = Number(router.query?.page) || 1

    const [currentPage, setCurrentPage] = useState(_currentPage)
    const handlePageClick = (pageNumber) => {
        router.push(`/blog/${pageNumber}`)
        setCurrentPage(pageNumber)
    }

    const getPaginationGroup = () => {
        let start = Math.max(1, currentPage - Math.floor(displayPageCount / 2))
        let end = Math.min(totalPageCount, currentPage + Math.floor(displayPageCount / 2))

        if (currentPage <= Math.ceil(displayPageCount / 2)) {
            end = start + displayPageCount
        }
        if (end >= totalPageCount) {
            start = totalPageCount - displayPageCount + 1
        }

        return new Array(displayPageCount).fill().map((_, idx) => start + idx)
    }

    return (
        <HStack justifyContent="center" my={12}>
            <Button variant="link" onClick={() => handlePageClick(currentPage - 1)} disabled={currentPage === 1}>
                <ChevronLeftIcon />
            </Button>
            {getPaginationGroup().map((page) => {
                return (
                    <Button onClick={() => handlePageClick(page)} isDisabled={currentPage === page} variant="link" key={page}>
                        <Text>{page}</Text>
                    </Button>
                )
            })}
            <Button variant="link" onClick={() => handlePageClick(currentPage + 1)} disabled={currentPage === totalPageCount}>
                <ChevronRightIcon />
            </Button>
        </HStack>
    )
}

export default Pagination
