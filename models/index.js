const Blog = require('./blog')
const User = require('./user')
const Readlists = require('./readlists')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readlists, as: 'usersListed' })
User.belongsToMany(Blog, { through: Readlists, as: 'listedBlogs' })

module.exports = {
  Blog, User, Readlists
}