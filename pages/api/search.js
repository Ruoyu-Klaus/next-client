import blogs from '../../_cachePosts/blogs.json'

export default (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(blogs))
}
