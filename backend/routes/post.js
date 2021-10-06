const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
// const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// const sauceValidation = require('../middleware/sauce-validation');

router.post('/', auth, multer, postCtrl.createPost);

router.put('/:id', auth, multer, postCtrl.modifyPost);

router.delete('/:id', auth, postCtrl.deletePost);

router.get('/:id', auth, postCtrl.getOnePost);

router.get('/', auth, postCtrl.getAllPosts);

router.post('/:id/like', auth, postCtrl.handleLikesAndDislikes);

module.exports = router;