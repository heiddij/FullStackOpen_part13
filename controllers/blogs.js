const router = require('express').Router()
require('express-async-errors')

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  })
  
  router.get('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      console.log(blog.toJSON())
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })
  
  router.post('/', async (req, res) => {
      const blog = await Blog.create(req.body)
      return res.json(blog)
  })
  
  router.delete('/:id', async (req, res) => {
      const blog = await Blog.findByPk(req.params.id)
      if (blog) {
        await blog.destroy()
      }
      res.status(204).end()
  })

  router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.json({likes: blog.likes})
  })

  module.exports = router