const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const userValidation = require('../middleware/user-validation');

router.post('/signup', userValidation, userCtrl.signup);
router.post('/login', userCtrl.login);
router.delete('/:id', auth, userCtrl.deleteUser);

module.exports = router;