'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột consultation_name vào bảng consultations
    await queryInterface.addColumn('consultations', 'consultation_name', {
      type: Sequelize.STRING,
      allowNull: true, // Hoặc false, tùy vào yêu cầu của bạn
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa cột consultation_name khỏi bảng consultations khi rollback
    await queryInterface.removeColumn('consultations', 'consultation_name');
  }
};
