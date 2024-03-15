'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Reviews', {
      review_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // Tên bảng users
          key: 'user_id', // Key trong bảng users mà user_id sẽ tham chiếu đến
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      major_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Majors', // Tên bảng majors
          key: 'major_id', // Key trong bảng majors mà major_id sẽ tham chiếu đến
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      pros: {
        type: Sequelize.TEXT
      },
      cons: {
        type: Sequelize.TEXT
      },
      // Thêm các trường createdAt và updatedAt nếu bạn muốn Sequelize tự động quản lý
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
    await queryInterface.dropTable('Reviews');
  }
};