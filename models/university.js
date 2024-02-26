'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  University.init({
    uni_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uni_code: DataTypes.STRING,
    uni_name: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    website: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'University',
  });
  return University;
};