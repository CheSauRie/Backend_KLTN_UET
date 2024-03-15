'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.User, { foreignKey: 'user_id' });
      Chat.hasMany(models.Message, { foreignKey: 'chat_id' });
    }
  }
  Chat.init({
    chat_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    summary: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};