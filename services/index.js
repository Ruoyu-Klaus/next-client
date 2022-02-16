import {request, gql} from 'graphql-request'

const graphqlAPI = process.env.GRAPHCMS_ENDPOINT

export const getPosts = async () => {
    const query = gql`
        query GetPosts {
            postsConnection {
                edges {
                    node {
                        date
                        excerpt
                        id
                        published
                        slug
                        tags
                        title
                        author {
                            name
                            picture {
                                url
                            }
                        }
                        featured
                        categories {
                            name
                            slug
                        }
                        coverImage {
                            url
                        }
                    }
                }
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result?.postsConnection?.edges?.map((item) => item.node) || []
}
export const getCategories = async () => {
    const query = gql`
        query GetCategories {
            categories {
                id
                name
                slug
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result?.categories || []
}

export const getPostsByCategoryId = async (id) => {
    const query = gql`
        query GetPostsByCategory {
            postsConnection(where: {categories_some: {id: "${id}"}}) {
                edges {
                    node {
                        id
                        author {
                            name
                            picture {
                                url
                            }
                        }
                        date
                        excerpt
                        featured
                        slug
                        tags
                        title
                        published
                        categories {
                            name
                            slug
                        }
                        coverImage {
                            url
                        }
                    }
                }
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result?.postsConnection?.edges?.map((item) => item.node) || []
}
