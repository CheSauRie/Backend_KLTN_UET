'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Review.belongsTo(models.User, { foreignKey: 'user_id' });
      Review.belongsTo(models.Major, { foreignKey: 'major_id' });
      Review.hasMany(models.Review, { foreignKey: 'parent_review_id' });
    }
  }
  Review.init({
    review_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: DataTypes.INTEGER,
    major_id: DataTypes.INTEGER,
    parent_review_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Review',
        key: 'review_id'
      }
    },
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};