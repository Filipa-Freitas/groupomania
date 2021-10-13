
// const Sequelize = require('sequelize');

// const User = sequelize.define("User", {
//     id: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     email: {
//         type: Sequelize.STRING,
//         allowNull: false,
//         unique: true
//     },
//     password: {
//         type: Sequelize.STRING,
//         allowNull: false
//     }

// });


// module.exports = User;

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            models.User.hasMany(models.Post, {
                onDelete: "cascade", hooks: true
            });
        }
    }
    User.init({
        userName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        profilePicture: DataTypes.STRING,
        description: DataTypes.STRING,
        isAdmin: DataTypes.BOOLEAN
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};