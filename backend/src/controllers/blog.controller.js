const Blog = require("../models/blog.model")
const User = require("../models/user.model")

const createBlog = async (req, res) => {
    try {
        const { title, content, categories } = req.body
        const userId = req.user._id

        const newBlog = await Blog.create({
            title, content, userId, categories
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
            return res.status(200).json({ message: "you unsaved this blog", saved: user.saved });
        }

        user.saved.push(blogId)
        await user.save();

        return res.status(200).json({ message: "you saved this blog", saved: user.saved })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const categories = req.query.categories ? req.query.categories.split(',') : [];
        const skip = (page - 1) * limit;

        const filter = {};
        if (categories.length > 0) {
            filter.categories = { $in: categories };
        }

        const blogs = await Blog.find(filter)
            .populate('userId', 'name email')
            .populate('comments.user', 'name')
            .populate("likes", "name _id")
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments(filter);

        return res.status(200).json({
            blogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const getAllBlogsByUser = async (req, res) => {
    const userId = req.user._id
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit;

        const blogs = await Blog.find({ userId })
            .populate('userId', 'name email')
            .populate('comments.user', 'name')
            .populate("likes", "name _id")
            .sort({ createdAt: -1 }) // newest first
            .skip(skip)
            .limit(limit);

        const totalBlogs = await Blog.countDocuments({ userId });

        return res.status(200).json({
            blogs,
            totalPages: Math.ceil(totalBlogs / limit),
            currentPage: page
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

const searchBlog = async (req, res) => {
    try {
        const keyword = req.query.search;
        const categories = req.query.categories?.split(',') || [];

        if (!keyword) {
            return res.status(400).json({ message: "Search keyword is required" });
        }

        const conditions = [
            {
                $or: [
                    { title: { $regex: keyword, $options: 'i' } },
                    { content: { $regex: keyword, $options: 'i' } }
                ]
            }
        ];

        if (categories.length > 0) {
            conditions.push({ categories: { $in: categories } });
        }

        const blogs = await Blog.find({ $and: conditions });

        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: 'Search failed' });
    }
}

const getCategories = async (req, res) => {
    try {
        const categories = await Blog.distinct("categories"); 
        return res.status(200).json({ categories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getBlog = async (req, res) => {
    try {
        const blogId = req.params.id

        const blog = await Blog.findById(blogId)
            .populate('userId', 'name email')
            .populate('comments.user', 'name')
            .populate("likes", "name _id")

        if (!blog) {
            return res.status(400).json({ message: "blog not found" })
        }

        return res.status(200).json({ blog })
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
    getAllBlogsByUser,
    getBlog,
    searchBlog,
    getCategories
}