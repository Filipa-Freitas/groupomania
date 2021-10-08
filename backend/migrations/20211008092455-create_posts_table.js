'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      content : {
        type: Sequelize.STRING,
        allowNull: false
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Posts');
  }
};
