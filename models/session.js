const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../util/db');

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' }
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session'
})

module.exports = Session
