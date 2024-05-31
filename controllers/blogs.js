const router = require('express').Router()
require('express-async-errors')

const { Blog } = require('../models')
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7))
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error){
      console.log(error)
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]: [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { author: { [Op.iLike]: `%${req.query.search}%` } }
      ]
    }
  }

  const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes', 'DESC']]
    })
    console.log(JSON.stringify(blogs, null, 2))
    res.json(blogs)
  })
  
  router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      console.log(blog.toJSON())
      res.json(blog)
    } else {
      res.status(404).end()
    }
  })
  
  router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({ ...req.body, userId: user.id })
    return res.json(blog)
  })
  
  router.delete('/:id', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.findByPk(req.params.id)

    if (blog.userId !== user.id) {
      return res.status(400).json({ error: 'token missing or invalid' })
    }

    await blog.destroy()
    res.status(204).end()
  })

  router.put('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    blog.likes = req.body.likes
    await blog.save()
    res.json({likes: blog.likes})
  })

  module.exports = router