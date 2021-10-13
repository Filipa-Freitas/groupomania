'use strict';

const { sequelize } = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
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
          model: "Users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      postId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Posts",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      content : {
        type: Sequelize.STRING,
        allowNull: false
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};
