require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const authRouter = require('./routes/auth.route');
const blogRouter = require('./routes/blog.route')

connectDB()
const app = express();
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)
app.use('/api/blog', blogRouter)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log('app is listening on port', PORT))