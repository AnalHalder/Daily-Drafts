const Blog = require("../models/blog.model")

const createBlog = async (req, res) => {
    try {
        const { title, content } = req.body
        const userId = req.user._id

        const newBlog = await Blog.create({
            title, content, userId
        })

        if (newBlog) {
            return res.status(200).json({ message: "blog created successfully", newBlog })
        } else {
            return res.status(400).json({ message: "something went wrong" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id
        const userId = req.user._id

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }
        if (userId.toString() === blog.userId.toString()) {
            await Blog.findByIdAndDelete(blogId);
            return res.status(200).json({ message: "blog successfully deleted" });
        } else {
            return res.status(400).json({ message: "only author of this blog can delete this blog" })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "internal server error" })
    }
}

const editBlog = async (req, res) => {
    try {
        const userId = req.user._id
        const blogId = req.params.id
        const { editedContent } = req.body

        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }
        if (!editedContent) {
            return res.status(400).json({ message: "content is required" })
        }

        if (blog.userId.toString() == userId.toString()) {
            blog.content = editedContent
            await blog.save();
            return res.status(200).json({ message: "blog edited successfully", blog })
        } else {
            return res.status(400).json({ message: "only author of this blog can edit" })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id
        const userId = req.user._id

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }

        if (blog.likes.includes(userId)) { // Prevent multiple likes by same user
            return res.status(400).json({ message: "you have already liked this blog" });
        }

        blog.likes.push(userId)
        await blog.save();

        return res.status(200).json({ message: "like added to blog", blog })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const commentBlog = async (req, res) => {
    try {
        const blogId = req.params.id
        const userId = req.user._id
        const { comment } = req.body
        const blog = await Blog.findById(blogId)

        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }
        if (!comment) {
            return res.status(400).json({ message: "cant't send emty comment" })
        }

        const newComment = {
            text: comment,
            user: userId
        }

        blog.comments.push(newComment)
        await blog.save();
        return res.status(200).json({ message: "comment added successfully", blog })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server errror" })
    }

}

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("userId", "name _id")
            .populate("comments.user", "name _id")
            .populate("likes", "name _id")
            .sort({ createdAt: -1 })
        return res.status(200).json({ blogs })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const getAllBlogsByUser = async (req, res) => {
    const userId = req.user._id
    try {
        const blogs = await Blog.find({userId})
            .populate("userId", "name _id")
            .populate("comments.user", "name _id")
            .populate("likes", "name _id")
            .sort({ createdAt: -1 })
        return res.status(200).json({ blogs })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

module.exports = {
    createBlog,
    deleteBlog,
    editBlog,
    likeBlog,
    commentBlog,
    getAllBlogs,
    getAllBlogsByUser
}