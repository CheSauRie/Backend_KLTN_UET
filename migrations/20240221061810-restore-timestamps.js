'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột createdAt và updatedAt vào bảng universities
    await queryInterface.addColumn('universities', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('universities', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // Thêm cột createdAt và updatedAt vào bảng markdownUnis
    await queryInterface.addColumn('markdownUnis', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('markdownUnis', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.renameColumn('markdownUnis', 'description', 'mission')
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa các cột nếu cần hoàn tác
    await queryInterface.removeColumn('universities', 'createdAt');
    await queryInterface.removeColumn('universities', 'updatedAt');
    await queryInterface.removeColumn('markdownUnis', 'createdAt');
    await queryInterface.removeColumn('markdownUnis', 'updatedAt');
  }
};
