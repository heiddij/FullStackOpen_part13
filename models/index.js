const Blog = require('./blog')
const User = require('./user')
const Readlists = require('./readlists')
const Session = require('./session')

User.hasMany(Blog)
Blog.belongsTo(User)

Blog.belongsToMany(User, { through: Readlists, as: 'usersListed' })
User.belongsToMany(Blog, { through: Readlists, as: 'listedBlogs' })

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Blog, User, Readlists, Session
}