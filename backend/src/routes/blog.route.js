const express = require('express');
const blogRouter = express.Router();

const protectRoute = require('../middlewares/auth.middleware');
const {
    createBlog,
    deleteBlog,
    editBlog,
    likeBlog,
    commentBlog,
    commentDelete,
    commentEdit,
    saveBlog,
    getAllBlogs,
    getAllBlogsByUser,
    searchBlog
} = require('../controllers/blog.controller');

blogRouter.post("/createblog", protectRoute, createBlog)

blogRouter.delete("/:id", protectRoute, deleteBlog)

blogRouter.patch("/:id", protectRoute, editBlog)

blogRouter.post("/:id/like", protectRoute, likeBlog)

blogRouter.post("/:id/comment", protectRoute, commentBlog)

blogRouter.delete("/:id/comment/:commentId", protectRoute, commentDelete)

blogRouter.patch("/:id/comment/:commentId", protectRoute, commentEdit)

blogRouter.post("/:id/save",protectRoute,saveBlog)

blogRouter.get("/getAllBlogs", getAllBlogs)

blogRouter.get("/getAllBlogsByUser", protectRoute, getAllBlogsByUser)

blogRouter.get("/search", searchBlog)

module.exports = blogRouter