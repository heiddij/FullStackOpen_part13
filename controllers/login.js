const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const Session = require('../models/session')
const { tokenExtractor } = require('../middlewares/tokenextractor')

router.post('/login', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'salainen'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  const session = await Session.create({ userId: user.id, token: token })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name, sessionId: session.id })
})

router.post('/logout', tokenExtractor, async (req, res, next) => {
  try {
    await Session.destroy({ where: { userId: req.decodedToken.id } });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router