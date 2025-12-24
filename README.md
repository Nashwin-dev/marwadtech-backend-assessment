# Backend Assessment - Marwadtech

This is a robust RESTful API built for the Back-end Developer Intern assessment. It handles user authentication, advanced product management, and analytics.

## 🚀 Features
* **Authentication:** Secure Login/Register with JWT & Password Hashing.
* **Product Management:** Advanced filtering (Date ranges, Status, Category), Sorting, and Pagination.
* **Analytics Dashboard:** Aggregated stats for Users and Products with time-based filtering (Today, Weekly, etc.).
* **Media Handling:** Secure image upload endpoint (Multer).

## 🛠️ Tech Stack
* Node.js & Express.js
* MongoDB (Mongoose)
* JWT (JSON Web Tokens)
* Multer (File Uploads)

## ⚙️ Setup Instructions
1.  Clone the repository.
2.  Run `npm install`.
3.  Create a `.env` file with:
    * `PORT=3000`
    * `MONGO_URI=your_mongodb_connection_string`
    * `JWT_SECRET=your_secret_key`
4.  Run `npm start`.

## 🧪 API Endpoints
* `POST /api/auth/register` - Create account
* `POST /api/auth/login` - Get Token
* `GET /api/products` - Fetch products (supports ?page=1&limit=10&search=Laptop)
* `GET /api/dashboard` - Get stats
* `POST /api/media/upload` - Upload image