const Sequelize = require('sequelize');

module.exports = sequelize.define("Post", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: Sequelize.STRING(300),
        allowNull: false,
    }
});