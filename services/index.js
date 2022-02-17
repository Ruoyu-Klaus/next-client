import {request, gql} from 'graphql-request'

const graphqlAPI = process.env.GRAPHCMS_ENDPOINT

export const getPosts = async () => {
    const query = gql`
        query GetPosts {
            postsConnection(orderBy: date_DESC) {
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

export const getTagRelatedPosts = async (slug, tags) => {
    const query = gql`
        query getTagRelatedPosts($slug: String!, $tags: [String!]) {
            posts(where: {slug_not: $slug, AND: {tags_contains_some: $tags}}, last: 3) {
                id
                title
                slug
                published
                featured
                date
                coverImage {
                    url
                }
                categories {
                    name
                    slug
                }
            }
        }
    `
    const result = await request(graphqlAPI, query, {slug, tags})
    return result?.posts || []
}

export const getPostDetailsBySlug = async (slug) => {
    const query = gql`
        query getPostDetailsBySlug($slug: String!) {
            post(where: {slug: $slug}) {
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
                contentMarkdown
            }
        }
    `
    const result = await request(graphqlAPI, query, {slug})
    return result?.post || {}
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
        query GetPostsByCategory($id: ID!) {
            postsConnection(where: {categories_some: {id: $id}}) {
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
    const result = await request(graphqlAPI, query, {id})
    return result?.postsConnection?.edges?.map((item) => item.node) || []
}

export const getTags = async () => {
    const query = gql`
        query getTags {
            posts {
                tags
            }
        }
    `
    const result = await request(graphqlAPI, query)
    return result?.posts || []
}
