'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UniversityScores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uni_code: {
        type: Sequelize.STRING
      },
      uni_name: {
        type: Sequelize.TEXT
      },
      major_code: {
        type: Sequelize.STRING
      },
      major_name: {
        type: Sequelize.TEXT
      },
      subject_group: {
        type: Sequelize.STRING
      },
      admission_score: {
        type: Sequelize.DECIMAL
      },
      year: {
        type: Sequelize.INTEGER
      },
      // createdAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // },
      // updatedAt: {
      //   allowNull: false,
      //   type: Sequelize.DATE
      // }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UniversityScores');
  }
};