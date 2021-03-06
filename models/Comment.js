const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../config/connection'); // imports the connection

class Comment extends Model {}

Comment.init({
  comment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
  },
  // date: {
  //   type: DataTypes.DATE,
  //   allowNull: false,
  //   defaultValue: DataTypes.NOW

  // },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
    },
  },
  post_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'post',
      key: 'post_id',
    },
  },
}, {
  sequelize,
  timestamps: true,
  freezeTableName: true,
  underscored: true,
  modelName: 'comment',
});

module.exports = Comment;