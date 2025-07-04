# 📝 Daily Drafts — Blog Application

Welcome to **Daily Drafts**, a feature-rich blog application where users can write, edit, and share their thoughts. Engage through likes, comments, and explore blogs by categories or keywords.

---

## 🚀 Features

- ✅ User authentication (signup, login, logout)
- ✅ Create, edit, delete blogs
- ✅ Like and Comment on blogs
- ✅ Edit and Delete comments
- ✅ Get all blogs or blogs by a specific user (paginated)
- ✅ Save or Unsave blogs
- ✅ Filter blogs by categories
- ✅ Search blogs by keyword (title or content)
- ✅ JWT Authentication with protected routes
- ✅ Error handling with proper status codes


---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Other Tools:** bcrypt, dotenv

---

## 📂 Folder Structure

```
src/
├── controllers/
│   └── auth.controller.js
│   └── blog.controller.js
├── middlewares/
│   └── auth.middleware.js
├── models/
│   └── user.model.js
│   └── blog.model.js
├── routes/
│   └── auth.routes.js
│   └── blog.routes.js
├── index.js
```

---

## 🔑 API Endpoints

### Authentication
| Method| Endpoint            | Description        |
|-------|---------------------|--------------------|
| POST  | `/api/auth/signup`       | Register user      |
| POST  | `/api/auth/login`        | Login user         |
| POST  | `/api/auth/logout`       | Logout user        |

### Blogs
| Method |         Endpoint             |             Description                  |
|--------|------------------------------|------------------------------------------|
| POST   | `/api/blog/createblog`                  | Create a new blog             |
| GET    | `/api/blog/getAllBlogs?page=&limit=&categories=`     | Get all blogs (paginated + filtered)  |
| GET    | `/api/blog/getAllBlogsByUser?page=&limit=`| Get blogs by a user           |
| PATCH  | `/api/blog/:id`                         | Edit a blog                   |
| DELETE | `/api/blog/:id`                         | Delete a blog                 |
| POST   | `/api/blog/:id/like`                    | Like or unlike a blog                   |
| POST   | `/api/blog/:id/comment`                 | Comment on a blog             |
| DELETE | `/api/blog/:id/comment/:commentId`      | Delete a comment              |
| PATCH  | `/api/blog/:id/comment/:commentId`      | Edit a comment                |
| POST   | `/api/blog/:id/save`                    | To save or unsave a blog by user        |
| GET    | `/api/blog/search?search=&categories=`  | Search blogs by keyword and filter by category |
| GET    | `/api/blog/categories`                  | Get all unique blog categories               |
| GET   | `/api/blog/:id`                          | To feth a particular blog       |

---

## ⚙️ Setup Instructions

1. Clone the repo:

```bash
git clone https://github.com/yourusername/daily-drafts.git
cd daily-drafts
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

4. Start the server:

```bash
npm start
```

Server will run at `http://localhost:5000`.

---

## 🙌 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---
