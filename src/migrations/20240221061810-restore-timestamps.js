'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Thêm cột createdAt và updatedAt vào bảng universities
    await queryInterface.addColumn('Universities', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('Universities', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });

    // Thêm cột createdAt và updatedAt vào bảng MarkdownUnis
    await queryInterface.addColumn('MarkdownUnis', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('MarkdownUnis', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.renameColumn('MarkdownUnis', 'description', 'mission')
  },

  down: async (queryInterface, Sequelize) => {
    // Xóa các cột nếu cần hoàn tác
    await queryInterface.removeColumn('Universities', 'createdAt');
    await queryInterface.removeColumn('Universities', 'updatedAt');
    await queryInterface.removeColumn('MarkdownUnis', 'createdAt');
    await queryInterface.removeColumn('MarkdownUnis', 'updatedAt');
    await queryInterface.renameColumn('MarkdownUnis', 'mission', 'description');
  }
};
