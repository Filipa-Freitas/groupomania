const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
        const userId = decodedToken.userId;
        if (req.body.userId && req.body.userId !== userId) {
            throw 'userId non valable !';
        } else {
            console.log(userId, "auth");
            next();
        }
    } catch (error) {
        console.log("oups");
        res.status(403).json({ message: error.message });
    }
};