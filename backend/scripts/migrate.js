const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Post = require("../models/post");

const migrate = async () => {
  try {
    await connectDB();
    const posts = await Post.find().sort({ _id: 1 }); // Oldest first
    for (let i = 0; i < posts.length; i++) {
      const p = posts[i];
      if (!p.projectId) { // Only update if missing
        const sequenceString = (i + 1).toString().padStart(4, '0');
        p.projectId = `P${sequenceString}`;
        await p.save();
        console.log(`Updated project to ${p.projectId}`);
      }
    }
    console.log("Migration completed successfully. Safe to exit.");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};

migrate();
