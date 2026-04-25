const express = require("express");

const router = express.Router();

const Posts = require("../models/post");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

//test route
router.get("/post", (req, res) => res.send("post route testing"));

//add post - insert
router.post("/", auth, async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);
        if(!student) return res.status(404).json({msg: "Student not found"});

        const latestPost = await Posts.findOne().sort({ _id: -1 });
        let nextSequence = 1;
        if (latestPost && latestPost.projectId) {
            nextSequence = parseInt(latestPost.projectId.substring(1)) + 1;
        } else if (latestPost) {
            const count = await Posts.countDocuments();
            nextSequence = count + 1;
        }
        
        req.body.projectId = 'P' + String(nextSequence).padStart(4, '0');
        req.body.itNumber = student.studentId;
        req.body.year = null;
        req.body.semester = null;
        req.body.specialization = null;
        
        await Posts.create(req.body);
        res.json({msg: "post added successfully"});
    } catch(err) {
        res.status(400).json({msg: "unable to add post"});
    }
});

//get all posts - read
router.get("/", async (req, res) => {
    try {
        const posts = await Posts.find().lean();
        // Dynamically append creator info
        for (let post of posts) {
            if (post.itNumber) {
                const student = await Student.findOne({ studentId: post.itNumber }).lean();
                if (student && student.academicInfo) {
                    post.specialization = student.academicInfo.specialization;
                    post.year = student.academicInfo.year;
                    post.semester = student.academicInfo.semester;
                }
                if (student) {
                    post.creatorId = student._id;
                }
            }
        }
        res.json(posts);
    } catch(err) {
        res.status(400).json({msg: "unable to fetch posts"});
    }
});

//get post by id - read
router.get("/:id", async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id).lean();
        if(post && post.itNumber) {
            const student = await Student.findOne({ studentId: post.itNumber }).lean();
            if(student && student.academicInfo) {
                post.specialization = student.academicInfo.specialization;
                post.year = student.academicInfo.year;
                post.semester = student.academicInfo.semester;
            }
            if (student) {
                post.creatorId = student._id;
            }
        }
        res.json(post);
    } catch(err) {
        res.status(400).json({msg: "unable to fetch by id post"});
    }
});

//update post by id
router.put("/:id", auth, (req, res) => {
    // Prevent updating locked fields
    delete req.body.itNumber;
    delete req.body.year;
    delete req.body.semester;
    delete req.body.specialization;

    Posts.findByIdAndUpdate(req.params.id, req.body)
    .then(() => res.json({msg: "post updated successfully"}))
    .catch(() => res.status(400).json({msg: "unable to update post"}));
});

//decrement team size specific route
router.put("/:id/decrement-team", auth, async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);
        if (!post) {
            return res.status(404).json({msg: "post not found"});
        }
        if (post.teamSize > 0) {
            post.teamSize -= 1;
            await post.save();
        }
        res.json({msg: "team size decremented successfully", teamSize: post.teamSize});
    } catch(err) {
        res.status(400).json({msg: "unable to decrement team size"});
    }
});

//delete post by id
router.delete("/:id", auth, (req, res) => {
    Posts.findByIdAndDelete(req.params.id)
    .then(() => res.json({msg: "post deleted successfully"}))
    .catch(() => res.status(400).json({msg: "unable to delete post"}));
});


module.exports = router;