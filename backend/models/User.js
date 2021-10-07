
const Sequelize = require('sequelize');
const sequelize = require('../config/db-connection');
const Post = require('./Post');

const User = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(20),
        allowNull: false
    }

});
User.hasMany(Post);
Post.belongsTo(User);

module.exports = User;