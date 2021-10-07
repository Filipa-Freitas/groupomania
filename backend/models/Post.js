const { Sequelize, DataTypes }  = require('sequelize');
const sequelize = require('../config/db-connection');

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false,
    }

}, {});


module.exports = Post;