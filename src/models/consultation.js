'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Consultation_schedules extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.University, { foreignKey: 'uni_id' });
      this.hasMany(models.Consultation_requests, { foreignKey: "schedule_id" })
    }
  }
  Consultation_schedules.init({
    schedule_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uni_id: DataTypes.INTEGER,
    meet_url: DataTypes.STRING,
    consultation_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Consultation_schedules',
  });
  return Consultation_schedules;
};