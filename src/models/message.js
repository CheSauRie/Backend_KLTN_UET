'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Message.belongsTo(models.Chat, { foreignKey: 'chat_id' });
    }
  }
  Message.init({
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chat_id: DataTypes.INTEGER,
    question: DataTypes.TEXT,
    answer: DataTypes.TEXT,
    summary: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};