// const { Sequelize, DataTypes }  = require('sequelize');


// const Post = sequelize.define("Post", {
//     id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     content: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     }

// }, {});


// module.exports = Post;


const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            models.Post.belongsTo(models.User);
        }
    }
    Post.init({
        content: DataTypes.TEXT,
        attachement: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Post',
    });
    return Post;
};