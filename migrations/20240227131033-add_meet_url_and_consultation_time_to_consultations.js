'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('consultations', 'meet_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('consultations', 'consultation_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('consultations', 'meet_url');
    await queryInterface.removeColumn('consultations', 'consultation_time');
  }
};