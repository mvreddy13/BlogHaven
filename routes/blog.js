const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../models/blog");
const Comment = require("../models/comments");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  return res.render("blog", {
    user: req.user || null,
    blog,
    comments,
  });
});

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.post("/add-new", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdBy: req.user._id,
    coverImage: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  try {
    const newComment = {
      content: req.body.content,
      blogId: req.body.blogId || req.params.blogId,
      createdBy: req.user._id,
    };

    const comment = await Comment.create(newComment);

    res.redirect(`/blog/${newComment.blogId}`);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
