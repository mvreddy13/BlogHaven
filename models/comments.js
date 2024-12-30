const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  blogId: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
