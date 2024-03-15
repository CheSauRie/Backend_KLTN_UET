'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    static associate(models) {
      University.hasMany(models.Major, { foreignKey: 'uni_id' })
      University.hasMany(models.FollowUni, { foreignKey: "uni_id" })
      University.hasMany(models.Consultation_Schedule, { foreignKey: 'uni_id' })
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