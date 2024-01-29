'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('Chats', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_chat_user_id',
      references: {
        table: 'Users',
        field: 'user_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('Chats', 'fk_chat_user_id');
  }
};

