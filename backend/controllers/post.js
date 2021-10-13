
const jwt = require('jsonwebtoken');
const { xssFilter } = require("../utils/security");
const fs = require('fs');
const db = require('../models');
const Post = db.Post;
const User = db.User;

function getUserId(data) {
  if (data.length > 1) {
    const token = data.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    const userId = decodedToken.userId;
    return userId
  }
}

exports.createPost = (req, res, next) => {

  let userId = getUserId(req.headers.authorization);

  User.findOne({ where: {id: userId} })
  .then(user => {
    if (user !== null) {
        const postObject = req.body;
        const filteredData = xssFilter(postObject);
        const post = new Post({
          UserId: user.id,
          ...filteredData,
          // attachement: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        });
        post.save()
        .then(() => res.status(201).json({message: "post créé !"}))
        .catch(error =>  res.status(400).json({ message: error.mesage }));
      } else {
        return res.status(401).json({ message: error.message});
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

exports.modifyPost = (req, res, next) => {
  let userId = getUserId(req.headers.authorization);

  Post.findOne({ where: {id: req.params.id}})
    .then(post => {
      if (post.UserId === userId) {
        const filteredData = xssFilter(req.body);
        const postObject = req.file ?
          {
            ...filteredData,
            attachement: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          } : xssFilter({ ...req.body });

        Post.update({ ...postObject, id: req.params.id }, { where: { id: req.params.id } })
          .then(() => res.status(200).json({ message: 'Post modifié !'}))
          .catch(error => res.status(400).json({ message: error.message }));
      } else {
        return res.status(401).json({ message: "Vous ne pouvez pas modifier ce post !"});
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

exports.deletePost = (req, res, next) => {
  let userId = getUserId(req.headers.authorization);

  Post.findOne({ where: {id: req.params.id} })
    .then(post => {
      if (post.UserId === userId) {
        
        if (post.attachement) {
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
          Post.destroy({ where: {id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Post supprimé !'}))
            .catch(error => res.status(400).json({ message: error.message }));
        });
        } else {
          Post.destroy({ where: {id: req.params.id} })
            .then(() => res.status(200).json({ message: 'Post supprimé !'}))
            .catch(error => res.status(400).json({ message: error.message }));
        }
      } else {
        return res.status(401).json({ message: "Vous ne pouvez pas supprimer ce post!"});
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

exports.getOnePost = (req, res, next) => {
  Post.findOne({ where: {id: req.params.id} })
    .then(post => res.status(200).json(post))
    .catch(error => res.status(404).json({ message: error.message }));
};

exports.getAllPosts = (req, res, next) => {
  Post.findAll()
    .then(post => res.status(200).json(post))
    .catch(error => res.status(400).json({ message: error.message }));
};


exports.handleLikesAndDislikes = (req, res, next) => {

  switch (req.body.like) {
    case 1 :
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersLiked: req.body.userId }, $inc: { likes: +1 }})
        .then(() => res.status(200).json({ message: 'J\'aime !'}))
        .catch(error => res.status(400).json({ message: error.message }));
      break;

    case 0 : 
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 }})
            .then(() => res.status(200).json({ message: 'like annulé !'}))
            .catch(error => res.status(400).json({ message: error.message }));
          } if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 }})
            .then(() => res.status(200).json({ message: 'dislike annulé !'}))
            .catch(error => res.status(400).json({ message: error.message }));
          }
        })
        .catch(error => res.status(400).json({ message: error.message }));
      break;

    case -1 :
      Sauce.updateOne({ _id: req.params.id }, { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 }})
        .then(() => res.status(200).json({ message: 'Je n\'aime pas !'}))
        .catch(error => res.status(400).json({ message: error.message }));
      break;

    default:
      throw new Error("Vote incorrect");
  }
};