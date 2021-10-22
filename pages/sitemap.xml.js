function generateSiteMap(paths) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://ruoyu.life</loc>
     </url>
     <url>
       <loc>https://ruoyu.life/blog</loc>
     </url>
     <url>
       <loc>https://ruoyu.life/blog/post/学习</loc>
     </url>
     <url>
       <loc>https://ruoyu.life/blog/post/生活</loc>
     </url>
     <url>
       <loc>https://ruoyu.life/blog/search</loc>
     </url>

     ${paths
       .map(path => {
         return `
       <url>
           <loc>${`${process.env.BASE_URL}${path}`}</loc>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

function SiteMap() {}

import { getArticleList } from '../request';

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const { rows } = await getArticleList();

  const paths = rows.map(
    post =>
      `blog/post/${post.category.category_name}/${post.id}/${post.post_title}`
  );
  const sitemap = generateSiteMap(paths);
  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
