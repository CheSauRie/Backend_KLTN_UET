'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('consultation_schedules', {
      schedule_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uni_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'universities',
          key: 'uni_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      consultation_time: {
        type: Sequelize.DATE
      },
      meet_url: {
        type: Sequelize.STRING
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('consultation_schedules');
  }
};
