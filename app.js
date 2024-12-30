const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const Blog = require("./models/blog");

const mongoose = require("mongoose");
const { checkAuthCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(console.log("MongoDB is Connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkAuthCookie("token"));
app.use(express.static(path.resolve("./public")));

// Routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user || null,
    blogs: allBlogs,
  });
});

app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(PORT, () => console.log(`Server started on the port ${PORT}`));
