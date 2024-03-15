'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UniversityScore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UniversityScore.init({
    uni_code: DataTypes.STRING,
    uni_name: DataTypes.TEXT,
    major_code: DataTypes.STRING,
    major_name: DataTypes.TEXT,
    subject_group: DataTypes.STRING,
    admission_score: DataTypes.DECIMAL,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UniversityScore',
    timestamps: 'false'
  });
  return UniversityScore;
};