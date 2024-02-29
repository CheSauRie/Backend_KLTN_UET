'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Major, { foreignKey: 'major_id' });
      this.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  Consultation.init({
    consultation_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    major_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    consulting_information: DataTypes.TEXT,
    status: DataTypes.BOOLEAN,
    consultation_phone: DataTypes.STRING,
    consultation_email: DataTypes.STRING,
    consultation_name: DataTypes.STRING,
    meet_url: DataTypes.STRING,
    consultation_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Consultation',
  });
  return Consultation;
};