'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.addColumn('universities', 'email', { type: Sequelize.STRING });
    // await queryInterface.addColumn('universities', 'expense', { type: Sequelize.INTEGER });
    await queryInterface.renameColumn('universities', 'image', 'logo');
    // Thêm cột 'background'
    await queryInterface.addColumn('universities', 'background', {
      type: Sequelize.STRING,
      allowNull: true
    });
    // Xóa các cột không cần thiết, ví dụ 'tution_fee'
    await queryInterface.removeColumn('universities', 'tution_fee');
    await queryInterface.removeColumn('universities', 'history');

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('universities', 'email');
    await queryInterface.removeColumn('universities', 'expense');
    // Thêm các lệnh để hoàn tác các thay đổi nếu cần
  }
};
