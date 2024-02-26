'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('universities', 'logo');
    await queryInterface.removeColumn('universities', 'admissions_method');
    await queryInterface.removeColumn('universities', 'number_major');
    await queryInterface.removeColumn('universities', 'student_have_job');
    await queryInterface.removeColumn('universities', 'expense');
    await queryInterface.removeColumn('universities', 'background');
    await queryInterface.addColumn('universities', 'uni_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('universities', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Bảng markdownUni: Thêm các cột mới và xóa các cột không cần thiết
    await queryInterface.addColumn('markdownUnis', 'logo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('markdownUnis', 'background', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('markdownUnis', 'createdAt');
    await queryInterface.removeColumn('markdownUnis', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
