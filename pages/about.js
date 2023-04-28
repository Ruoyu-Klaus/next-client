import Head from 'next/head'
import Author from '../components/Author'
import BlogLayout from '../layout/BlogLayout'
import {Container} from '@chakra-ui/react'

function Index() {
    return (
        <>
            <Head>
                <title>About | 首页</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Container w="fit-content">
                <Author />
            </Container>
        </>
    )
}

Index.getLayout = function getLayout(page) {
    return <BlogLayout showModel>{page}</BlogLayout>
}

export default Index
