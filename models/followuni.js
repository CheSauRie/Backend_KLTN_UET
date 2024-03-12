'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FollowUni extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      FollowUni.belongsTo(models.User, { foreignKey: 'user_id' });
      FollowUni.belongsTo(models.University, { foreignKey: 'uni_id' });
    }
  }
  FollowUni.init({
    fu_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    uni_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'FollowUni',
  });
  return FollowUni;
};