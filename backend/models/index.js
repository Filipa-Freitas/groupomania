'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
require('dotenv').config();
const db = {};

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    define: {
      timestamps: false
    }
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


// db.users = require("./user.js")(sequelize, Sequelize)
// db.posts = require("./post.js")(sequelize, Sequelize)
// db.comments = require("./comment.js")(sequelize, Sequelize)

// db.comments.belongsTo(db.posts)
// db.comments.belongsTo(db.users)
// db.posts.hasMany(db.comments)
// db.posts.belongsTo(db.users)
// db.users.hasMany(db.posts)
// db.users.hasMany(db.comments)


module.exports = db;
