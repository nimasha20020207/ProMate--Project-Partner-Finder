const express = require("express");

const router = express.Router();

const Posts = require("../models/post");

//test route
router.get("/post", (req, res) => res.send("post route testing"));


module.exports = router;