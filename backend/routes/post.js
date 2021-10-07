const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
// const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
// const sauceValidation = require('../middleware/sauce-validation');

router.post('/', postCtrl.createPost);

router.put('/:id', multer, postCtrl.modifyPost);

router.delete('/:id', postCtrl.deletePost);

router.get('/:id', postCtrl.getOnePost);

router.get('/', postCtrl.getAllPosts);

router.post('/:id/like', postCtrl.handleLikesAndDislikes);

module.exports = router;