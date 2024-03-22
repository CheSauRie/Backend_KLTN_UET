'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MarkdownUnis', {
      uni_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Universities',
          key: 'uni_id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      description: {
        type: Sequelize.TEXT
      },
      admissions_criteria: {
        type: Sequelize.TEXT
      },
      admission_method: {
        type: Sequelize.TEXT
      },
      tution_fee: {
        type: Sequelize.TEXT
      },
      teaching_staff: {
        type: Sequelize.TEXT
      },
      dormitory: {
        type: Sequelize.TEXT
      },
      library: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('MarkdownUnis');
  }
};