module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.removeColumn('Reviews', 'pros');
    await queryInterface.removeColumn('Reviews', 'cons');
    await queryInterface.addColumn('Reviews', 'content', {
      type: Sequelize.TEXT,
      allowNull: false
    })
    await queryInterface.addColumn('Reviews', 'parent_review_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Reviews',
        key: 'review_id',
      },
    });

  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reviews', 'parent_review_id');
    await queryInterface.removeColumn('Reviews', 'content');
    await queryInterface.addColumn('Reviews', 'cons', {
      type: Sequelize.TEXT,
      allowNull: true, // Adjust based on your actual schema requirements
    });
    await queryInterface.addColumn('Reviews', 'pros', {
      type: Sequelize.TEXT,
      allowNull: true, // Adjust based on your actual schema requirements
    });
  }
};
