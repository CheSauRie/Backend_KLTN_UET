'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Majors', {
      major_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uni_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Universities', // Tên bảng phải đúng với tên bảng đã tạo
          key: 'uni_id', // Khóa chính của bảng Universities mà bạn muốn liên kết
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      major_name: {
        type: Sequelize.STRING
      },
      major_code: {
        type: Sequelize.STRING
      },
      admissions_information: {
        type: Sequelize.TEXT
      },
      admissions_method: {
        type: Sequelize.TEXT
      },
      description_major: {
        type: Sequelize.TEXT
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Majors');
  }
};
