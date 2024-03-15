'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ConsultationRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ConsultationRequest.belongsTo(models.User, { foreignKey: 'user_id' })
      ConsultationRequest.belongsTo(models.Consultation_Schedule, { foreignKey: 'schedule_id' })
    }
  }
  ConsultationRequest.init({
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
    modelName: 'ConsultationRequest',
    tableName: 'consultation_requests',
    timestamps: false
  });
  return ConsultationRequest;
};