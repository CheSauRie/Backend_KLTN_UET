'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Universities', 'logo');
    await queryInterface.removeColumn('Universities', 'admissions_method');
    await queryInterface.removeColumn('Universities', 'number_major');
    await queryInterface.removeColumn('Universities', 'student_have_job');
    await queryInterface.removeColumn('Universities', 'expense');
    await queryInterface.removeColumn('Universities', 'background');
    await queryInterface.addColumn('Universities', 'uni_name', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Universities', 'description', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    // Bảng markdownUni: Thêm các cột mới và xóa các cột không cần thiết
    await queryInterface.addColumn('MarkdownUnis', 'logo', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('MarkdownUnis', 'background', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.removeColumn('MarkdownUnis', 'createdAt');
    await queryInterface.removeColumn('MarkdownUnis', 'updatedAt');
  },

  async down(queryInterface, Sequelize) {
    // Reverse operations for 'Universities' table
    await queryInterface.addColumn('Universities', 'logo', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Universities', 'admissions_method', {
      type: Sequelize.STRING,

    });
    await queryInterface.addColumn('Universities', 'number_major', {
      type: Sequelize.INTEGER,

    });
    await queryInterface.addColumn('Universities', 'student_have_job', {
      type: Sequelize.BOOLEAN,

    });
    await queryInterface.addColumn('Universities', 'expense', {
      type: Sequelize.INTEGER,

    });
    await queryInterface.addColumn('Universities', 'background', {
      type: Sequelize.STRING,

    });
    await queryInterface.removeColumn('Universities', 'uni_name');
    await queryInterface.removeColumn('Universities', 'description');

    // Reverse operations for 'MarkdownUnis' table
    await queryInterface.removeColumn('MarkdownUnis', 'logo');
    await queryInterface.removeColumn('MarkdownUnis', 'background');
    await queryInterface.addColumn('MarkdownUnis', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
    await queryInterface.addColumn('MarkdownUnis', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }

};
