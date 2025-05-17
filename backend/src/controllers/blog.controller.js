const Blog = require("../models/blog.model")
const User = require("../models/user.model")


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
            blog.likes = blog.likes.filter(ele => ele.toString() != userId.toString());
            await blog.save();
            return res.status(200).json({ message: "you unliked this blog", blog });
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

const commentDelete = async (req, res) => {
    const userId = req.user._id
    const blogId = req.params.id
    const commentId = req.params.commentId

    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(400).json({ message: "blog not found" })
    }

    const comment = blog.comments.id(commentId) /*here .id works but .findById dont because comments is a Mongoose subdocument array, and .id() is a special method provided by Mongoose for subdocument arrays. A subdocument is just a nested object inside another document. It has no special methods — it's just plain data.*/
    if (!comment) {
        return res.status(400).json({ message: "comment not found" })
    }

    if (userId.toString() !== comment.user.toString()) {
        return res.status(400).json({ message: "only commented person can delete this" })
    }

    blog.comments = blog.comments.filter(ele => ele._id.toString() !== commentId)
    await blog.save();

    return res.status(200).json({ message: "comment succesfully deleted", blog })
}

const commentEdit = async (req, res) => {
    const userId = req.user._id
    const blogId = req.params.id
    const { editComment } = req.body
    const commentId = req.params.commentId

    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(400).json({ message: "blog not found" })
    }

    const comment = blog.comments.id(commentId)
    if (!comment) {
        return res.status(400).json({ message: "comment not found" })
    }

    if (userId.toString() !== comment.user.toString()) {
        return res.status(400).json({ message: "only commented person can edit this" })
    }

    comment.text = editComment
    await blog.save();

    return res.status(200).json({ message: "comment succesfully edited", blog })
}

const saveBlog = async (req, res) => {
    try {
        const blogId = req.params.id
        const userId = req.user._id

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }

        const user = await User.findById(userId);
        if (user.saved.includes(blogId)) {
            user.saved = user.saved.filter(ele => ele.toString() != blogId.toString());
            await user.save();
            return res.status(200).json({ message: "you unsaved this blog", saved : user.saved });
        }

        user.saved.push(blogId)
        await user.save();

        return res.status(200).json({ message: "you saved this blog", saved : user.saved })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
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
        const blogs = await Blog.find({ userId })
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
    commentDelete,
    commentEdit,
    saveBlog,
    getAllBlogs,
    getAllBlogsByUser
}