function generateSiteMap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
       <url>
       <loc>${process.env.HOST_NAME}</loc>
     </url>
     
     ${paths
       .map(path => {
         return `
       <url>
           <loc>${`${process.env.HOST_NAME}/${path}`}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {}

import { Blog } from '../helpers'

export async function getServerSideProps({ res }) {
  const blog = new Blog()
  const posts = blog.getAllBlogs()
  const categories = blog.getAllCategories()
  let paths = ['blog']
  paths.concat(categories.map(category => `blog/post/${category}`))
  paths.concat(posts.map(post => `blog/post/${post.category}/${post.id}`))

  const sitemap = generateSiteMap(paths)
  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
