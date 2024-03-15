'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Universities', 'email', { type: Sequelize.STRING });
    await queryInterface.addColumn('Universities', 'expense', { type: Sequelize.INTEGER });
    await queryInterface.renameColumn('Universities', 'image', 'logo');
    await queryInterface.addColumn('Universities', 'background', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('Universities', 'tution_fee');
    await queryInterface.removeColumn('Universities', 'history');

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Universities', 'background');
    await queryInterface.renameColumn('Universities', 'logo', 'image');
    await queryInterface.addColumn('Universities', 'tution_fee', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('Universities', 'history', { type: Sequelize.TEXT });
    await queryInterface.removeColumn('Universities', 'expense');
    await queryInterface.removeColumn('Universities', 'email');
  }
};
