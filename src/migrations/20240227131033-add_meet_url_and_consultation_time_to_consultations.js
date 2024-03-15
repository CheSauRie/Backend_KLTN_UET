'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Consultations', 'meet_url', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('Consultations', 'consultation_time', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Consultations', 'meet_url');
    await queryInterface.removeColumn('Consultations', 'consultation_time');
  }
};