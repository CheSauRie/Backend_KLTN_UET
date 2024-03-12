'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('consultations');
  },

  down: async (queryInterface, Sequelize) => {
    // Code để tái tạo bảng `consultations` nếu cần
  }
};
