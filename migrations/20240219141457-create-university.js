'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Universities', {
      uni_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uni_code: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      website: {
        type: Sequelize.STRING
      },
      history: {
        type: Sequelize.TEXT
      },
      tution_fee: {
        type: Sequelize.DECIMAL
      },
      admissions_method: {
        type: Sequelize.STRING
      },
      number_major: {
        type: Sequelize.INTEGER
      },
      student_have_job: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Universities');
  }
};