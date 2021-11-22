'use strict';
const {
  Model, Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    //should these be "type" instead of DataTypes?  I changed them anyway.
    title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please enter a title.',
          },
          notEmpty: {
            msg: 'Please provide a book title',
          }
        }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please enter a author.',
        },
        notEmpty: {
          msg: 'Please provide a book author',
        }
      }
    },
    genre: {
      type: Sequelize.STRING
    },
    year: {
      type: Sequelize.INTEGER
    },
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};