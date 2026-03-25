const express = require("express");

const router = express.Router();

const Posts = require("../models/post");

//test route
router.get("/post", (req, res) => res.send("post route testing"));

//add post
router.post("/", (req, res) => {
    Posts.create(req.body)
    .then(() => res.json({msg: "post added successfully"}))
    .catch(() => res.status(400).json({msg: "unable to add post"}));
});
module.exports = router;