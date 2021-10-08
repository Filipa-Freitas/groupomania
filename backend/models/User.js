
const Sequelize = require('sequelize');
const sequelize = require('../config/db-connection');
const Post = require('./Post');

const User = sequelize.define("User", {
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
User.hasMany(Post);
Post.belongsTo(User);

module.exports = User;