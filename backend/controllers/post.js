
const jwt = require('jsonwebtoken');
const { xssFilter } = require("../utils/security");
const fs = require('fs');
const db = require('../models');
const Post = db.Post;
const User = db.User;

exports.createPost = (req, res, next) => {
  User.findOne({ id: req.userId })
    .then((user) => {
      if (user !== null) {
        const postObject = req.body;
        const filteredData = xssFilter(postObject);
        const post = new Post({
          UserId: user.id,
          ...filteredData,
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
  const filteredData = xssFilter(req.body.sauce);
  const sauceObject = req.file ?
    {
      ...filteredData,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : xssFilter({ ...req.body });

  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiéé !'}))
    .catch(error => res.status(400).json({ message: error.message }));
};

exports.deletePost = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
  const userId = decodedToken.userId;

  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (sauce.userId === userId) {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ message: error.message }));
      });
      } else {
        return res.status(401).json({ message: "Vous ne pouvez pas supprimer cette sauce !"});
      }
    })
    .catch(error => res.status(500).json({ message: error.message }));
};

exports.getOnePost = async (req, res, next) => {
  // Sauce.findOne({ _id: req.params.id })
  //   .then(sauce => res.status(200).json(sauce))
  //   .catch(error => res.status(404).json({ message: error.message }));
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