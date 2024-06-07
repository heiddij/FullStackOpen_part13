const router = require('express').Router()
require('express-async-errors')
const { Op } = require('sequelize')

const { User } = require('../models')
const { Blog } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog
    }
  })
  res.json(users)
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    next(error)
  }
})

router.get('/:id', async (req, res) => {
  let read = {
    [Op.in]: [true, false]
  }
  if ( req.query.read ) {
    read = req.query.read === "true"
  }

  const user = await User.findByPk(req.params.id, {
    include: {
      model: Blog,
      as: 'listedBlogs',
      attributes: { exclude: ['createdAt', 'updatedAt', 'userId']},
      through: {
        attributes: ['read', 'id'],
        where: {
          read
        }
      },
    },
  })

  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

router.put('/:username', async (req, res) => {
    const user = await User.findOne({ where: { username: req.params.username }})
    user.name = req.body.name
    await user.save()
    res.json({user})
})

module.exports = router