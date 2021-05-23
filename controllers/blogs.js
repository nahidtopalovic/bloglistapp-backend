const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.use(middleware.tokenExtractor)

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs.map(blog => blog.toJSON()))
})

blogRouter.post('/', async (request, response) => {
  const newBlog = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  const blog = new Blog({
    title: newBlog.title,
    author: newBlog.author,
    url: newBlog.url,
    likes: newBlog.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === decodedToken.id) {
    const deletedBlog = await blog.remove()
    const modifiedBlogs = user.blogs.filter(id => id !== deletedBlog._id)
    user.blogs = modifiedBlogs
    await user.save()
    return response.status(204).end()
  }

  response.status(400).json({ error: 'invalid permissions' })
})

// route for likes
blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!request.token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes + 1,
    user: user._id,
  }

  if (blog.user.toString() === decodedToken.id) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    })

    return response.json(updatedBlog.toJSON())
  }

  response.status(400).json({ error: 'invalid permissions' })
})

module.exports = blogRouter
