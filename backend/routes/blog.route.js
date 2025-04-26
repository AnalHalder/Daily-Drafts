const express = require('express');
const route = express.Router();

const protectRoute = require('../middlewares/auth.middleware');
const {
    createBlog,
    deleteBlog,
    editBlog,
    likeBlog,
    commentBlog,
    getAllBlogs,
    getAllBlogsByUser,
} = require('../controllers/blog.controller');

route.post("/createblog", protectRoute, createBlog)
route.delete("/deleteblog/:id", protectRoute, deleteBlog)
route.patch("/editblog/:id", protectRoute, editBlog)
route.post("/likeblog/:id", protectRoute, likeBlog)
route.post("/commentblog/:id", protectRoute, commentBlog)
route.get("/getAllBlogs", getAllBlogs)
route.get("/getAllBlogsByUser", protectRoute, getAllBlogsByUser)

module.exports = route