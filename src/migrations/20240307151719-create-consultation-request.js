'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Consultation_requests', {
      request_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      consultation_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Consultation_schedules', // Tên bảng consultations
          key: 'schedule_id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Tên bảng users
          key: 'user_id'
        }
      },
      user_phone: {
        type: Sequelize.STRING
      },
      user_email: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      consulting_information: {
        type: Sequelize.TEXT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Consultation_requests');
  }
};
