const express = require("express");

const router = express.Router();

const Posts = require("../models/post");

//test route
router.get("/post", (req, res) => res.send("post route testing"));

//add post - insert
router.post("/", async (req, res) => {
    try {
        const latestPost = await Posts.findOne().sort({ _id: -1 });
        let nextSequence = 1;
        if (latestPost && latestPost.projectId) {
            nextSequence = parseInt(latestPost.projectId.substring(1)) + 1;
        } else if (latestPost) {
            const count = await Posts.countDocuments();
            nextSequence = count + 1;
        }
        
        req.body.projectId = 'P' + String(nextSequence).padStart(4, '0');
        
        await Posts.create(req.body);
        res.json({msg: "post added successfully"});
    } catch(err) {
        res.status(400).json({msg: "unable to add post"});
    }
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

//update post by id
router.put("/:id", (req, res) => {
    Posts.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({msg: "post updated successfully"}))
    .catch(() => res.status(400).json({msg: "unable to update post"}));
});

//delete post by id
router.delete("/:id", (req, res) => {
    Posts.findByIdAndDelete(req.params.id)
    .then(() => res.json({msg: "post deleted successfully"}))
    .catch(() => res.status(400).json({msg: "unable to delete post"}));
});


module.exports = router;