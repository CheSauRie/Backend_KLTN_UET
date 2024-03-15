'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Consultations', {
      consultation_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      major_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Majors', // tên bảng 'Majors'
          key: 'major_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // tên bảng 'Users'
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      consulting_information: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      consultation_phone: {
        type: Sequelize.STRING
      },
      consultation_email: {
        type: Sequelize.STRING
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Consultations');
  }
};