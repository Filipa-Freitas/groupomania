const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const { xssFilter } = require('../utils/security');
require('dotenv').config();

exports.signup = (req, res, next) => {
    const filteredBody = xssFilter(req.body);
    
    bcrypt.hash(filteredBody.password, 10)
        .then(hash => {
            const user = new User({
                userName: filteredBody.userName,
                email: filteredBody.email,
                password: hash
            });
        user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ message: error.message }));
        })    
        .catch(error => res.status(500).json({ message: error.message }));
};

exports.login = (req, res, next) => {
    const filteredBody = xssFilter(req.body);
    User.findOne({ email: filteredBody.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(filteredBody.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user.id,
                        token: jwt.sign(
                            { userId: user.id },
                            process.env.SECRET_TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ message: error.message }));
        })
        .catch(error => res.status(500).json({ message: error.message }));
};

exports.deleteUser = (req, res, next) => {

};