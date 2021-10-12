'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Posts', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      content : {
        type: Sequelize.STRING,
        allowNull: false
      },
      attachement: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt:  {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    })
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Posts');
  }
};
