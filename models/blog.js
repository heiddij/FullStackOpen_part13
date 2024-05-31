const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

const currentYear = new Date().getFullYear();

Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1991,
        max: currentYear,
        isInt: true,
        customValidator(value) {
          if (value < 1991 || value > currentYear) {
            throw new Error(`Year must be between 1991 and ${currentYear}`);
          }
        }
      }
    }
  }, {
    sequelize,
    underscored: true, // taulun nimi Blog -> blogs (kaksi osaisessa _ (studyGroup -> study_group))
    modelName: 'blog'
  })

  module.exports = Blog