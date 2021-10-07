// const Sauce = require('../models/sauce');
const jwt = require('jsonwebtoken');
// const db = require('../models/index');
// const { xssFilter } = require("../utils/security");
const fs = require('fs');
const Post = require('../models/Post');

exports.createPost = async (req, res, next) => {
  // const sauceObject = JSON.parse(req.body.sauce);
  // delete sauceObject._id;
  // const filteredData = xssFilter(sauceObject);
  // const sauce = new Sauce({
  //   ...filteredData,
  //   imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
  //   likes: 0,
  //   dislikes: 0,
  //   userLiked: [],
  //   userDisliked: [],
  // });
  const post = await Post.create({
    content: req.body.content
  })
    .then(() => res.status(201).json({message: "post créé !"}))
    .catch(error =>  res.status(400).json({ message: error.mesage }));
  // sauce.save()
  //   .then(() => res.status(201).json({ message: 'sauce enregistrée !'}))
  //   .catch(error => res.status(400).json({ message: error.message }));


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

exports.getAllPosts = async (req, res, next) => {
  // Sauce.find()
  //   .then(sauce => res.status(200).json(sauce))
  //   .catch(error => res.status(400).json({ message: error.message }));
  // const osef = await Post.create({ content: "tralala" });
  
  // console.log(osef);
  // const posts = await Post.findAll();
  // console.log(posts);
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