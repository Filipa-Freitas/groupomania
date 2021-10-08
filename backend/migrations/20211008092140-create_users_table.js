'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', { 
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};
