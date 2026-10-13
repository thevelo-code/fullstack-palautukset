const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/middleware')


console.log('blogsRouter initialized')

/*const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.get('/', async (request, response) => {
  // console.log('GET /api/blogs')
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body
  // console.log('POST /api/blogs')
  const userId = request.user
  const user = await User.findById(userId)

  if (!userId) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const result = await newBlog.save()
  user.blogs = user.blogs.concat(result._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userId = request.user
  if (!userId) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blogToDelete.user.toString() !== userId) {
    return response.status(403).json({ error: 'unauthorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  const user = await User.findById(userId)
  user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
  await user.save()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const updatedBlog = await Blog.findById(request.params.id)

  if (!updatedBlog) {
    return response.status(404).end()
  }

  updatedBlog.title = title || updatedBlog.title
  updatedBlog.author = author || updatedBlog.author
  updatedBlog.url = url || updatedBlog.url
  updatedBlog.likes = likes || updatedBlog.likes

  await updatedBlog.save()
  response.json(updatedBlog)
})

module.exports = blogsRouter