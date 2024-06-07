const router = require('express').Router()
require('express-async-errors')
const { tokenExtractor } = require('../middlewares/tokenextractor')
const { Session } = require('../models')
const { User } = require('../models')
const { Readlists } = require('../models')

router.post('/', async (req, res, next) => {
    try {
      const list = await Readlists.create(req.body);
      res.json(list);
    } catch (error) {
      console.error('Error creating readlist:', error); // Log the full error
      next(error); // Pass the error to the error handler middleware
    }
  })

  router.put('/:id', tokenExtractor, async (req, res) => {
    const authorization = req.get('authorization').substring(7)
    const session = await Session.findOne({ where: { token: authorization }})
    const user = await User.findByPk(req.decodedToken.id)

    if (!session) {
      return res.status(400).json({ error: 'Please log in.' })
    }

    if (user.disabled) {
      await Session.destroy({ where: { userId: req.decodedToken.id } });
      return res.status(400).json({ error: 'account disabled, please contact admin' })
    }

    const list = await Readlists.findByPk(req.params.id)
    list.read = req.body.read
    await list.save()
    res.json({list})
})

module.exports = router