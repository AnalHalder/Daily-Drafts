const express = require('express');
const route = express.Router();

const protectRoute = require('../middlewares/auth.middleware');
const {
    createBlog,
    deleteBlog,
    editBlog,
    likeBlog,
    commentBlog,
    commentDelete,
    commentEdit,
    getAllBlogs,
    getAllBlogsByUser,
} = require('../controllers/blog.controller');

route.post("/createblog", protectRoute, createBlog)

route.delete("/:id", protectRoute, deleteBlog)

route.patch("/:id", protectRoute, editBlog)

route.post("/:id/like", protectRoute, likeBlog)

route.post("/:id/comment", protectRoute, commentBlog)

route.delete("/:id/comment/:commentId", protectRoute, commentDelete)

route.patch("/:id/comment/:commentId", protectRoute, commentEdit)

route.get("/getAllBlogs", getAllBlogs)

route.get("/getAllBlogsByUser", protectRoute, getAllBlogsByUser)

module.exports = route