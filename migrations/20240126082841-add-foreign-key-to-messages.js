'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.addConstraint('Messages', {
      fields: ['chat_id'],
      type: 'foreign key',
      name: 'fk_messages_chat_id',
      references: {
        table: 'Chats',
        field: 'chat_id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.removeConstraint('Messages', 'fk_messages_chat_id');
  }
};
