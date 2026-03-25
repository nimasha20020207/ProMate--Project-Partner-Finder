const express = require("express");

const router = express.Router();

const Posts = require("../models/post");

//test route
router.get("/post", (req, res) => res.send("post route testing"));

//add post - insert
router.post("/", (req, res) => {
    Posts.create(req.body)
    .then(() => res.json({msg: "post added successfully"}))
    .catch(() => res.status(400).json({msg: "unable to add post"}));
});

//get all posts - read
router.get("/", (req, res) => {
    Posts.find()
    .then((posts) => res.json(posts))
    .catch(() => res.status(400).json({msg: "unable to fetch posts"}));
});

//get post by id - read
router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
    .then((post) => res.json(post))
    .catch(() => res.status(400).json({msg: "unable to fetch by id post"}));
});


module.exports = router;