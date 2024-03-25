'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation_requests extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Consultation_requests.belongsTo(models.User, { foreignKey: 'user_id' })
      Consultation_requests.belongsTo(models.Consultation_schedules, { foreignKey: 'schedule_id' })
    }
  }
  Consultation_requests.init({
    request_id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    schedule_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    user_phone: DataTypes.STRING,
    user_email: DataTypes.STRING,
    username: DataTypes.STRING,
    consulting_information: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Consultation_requests',
    timestamps: false
  });
  return Consultation_requests;
};