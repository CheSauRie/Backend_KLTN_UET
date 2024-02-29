'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Major extends Model {
    static associate(models) {
      // Thiết lập liên kết với model University
      Major.belongsTo(models.University, { foreignKey: 'uni_id' });
      Major.hasMany(models.Review, { foreignKey: "major_id" })
      Major.hasMany(models.Consultation, { foreignKey: 'major_id' })
    }
  };
  Major.init({
    major_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uni_id: DataTypes.INTEGER,
    major_name: DataTypes.STRING,
    major_code: DataTypes.STRING,
    admissions_information: DataTypes.TEXT,
    admissions_method: DataTypes.TEXT,
    description_major: DataTypes.TEXT,
    quota: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Major',
  });
  return Major;
};