'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MarkdownUni extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // MarkdownUni.hasOne((models.University, { foreignKey: 'uni_id' }))
    }
  }
  MarkdownUni.init({
    uni_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    mission: DataTypes.TEXT,
    admissions_criteria: DataTypes.TEXT,
    admission_method: DataTypes.TEXT,
    tution_fee: DataTypes.TEXT,
    teaching_staff: DataTypes.TEXT,
    dormitory: DataTypes.TEXT,
    library: DataTypes.TEXT,
    logo: DataTypes.STRING,
    background: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'MarkdownUni',
  });
  return MarkdownUni;
};