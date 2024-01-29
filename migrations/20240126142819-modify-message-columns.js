'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Messages', 'question', {
      type: Sequelize.TEXT
    });
    await queryInterface.changeColumn('Messages', 'answer', {
      type: Sequelize.TEXT
    });
    await queryInterface.changeColumn('Chats', 'summary', {
      type: Sequelize.TEXT
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Messages', 'question', {
      type: Sequelize.STRING
    });
    await queryInterface.changeColumn('Messages', 'answer', {
      type: Sequelize.STRING
    });
  }
};

