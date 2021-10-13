const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        static associate(models) {
            models.Comment.belongsTo(models.User)
            models.Comment.belongsTo(models.Post)
        }
    }
    Comment.init({
        content: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Comment',
    });
    return Comment;
};