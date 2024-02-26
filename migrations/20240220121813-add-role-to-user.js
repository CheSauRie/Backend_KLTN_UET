'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'user' // Giả sử mặc định tất cả người dùng mới sẽ có vai trò là 'user'
    });

    await queryInterface.removeColumn('Universities', 'createdAt');
    await queryInterface.removeColumn('Universities', 'updatedAt');
  },


  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'role');
  }
};
