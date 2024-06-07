const router = require('express').Router()
require('express-async-errors')
const { tokenExtractor } = require('../middlewares/tokenextractor')

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
    const list = await Readlists.findByPk(req.decodedToken.id)
    list.read = req.body.read
    await list.save()
    res.json({list})
})

module.exports = router