const router = require('express').Router()
const { Blog } = require('../models');
const { Sequelize } = require('sequelize');

router.get('/authors', async (req, res) => {
  const blogs = await Blog.findAll({
    attributes: [
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'blogs'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
    ],
    group: ['author'],
    order: [['likes', 'DESC']]
  });
  console.log(JSON.stringify(blogs, null, 2));
  res.json(blogs);
});

module.exports = router;