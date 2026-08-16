---

### Backend README (`README.md`)


# ⚙️ AutoDealer API — RESTful Backend Service

A robust RESTful API built from scratch using **Node.js**, **Express**, and **MongoDB**. Provides backend services for automotive inventory management, structured data validation, and administrative CRUD operations.

🔗 **Frontend Repository:** [AutoDealer Client](https://github.com/inNetMedia/car-dealer-front-end.git)

---

## 🌟 Architecture & Highlights

* **Full CRUD Operations:** Custom endpoints for fetching, adding, modifying, and managing vehicle stock data.
* **Database Modeling:** Scalable schema design using **Mongoose** with strong validation rules for vehicle attributes.
* **RESTful Standards:** Predictable HTTP status codes, structured JSON payloads, and clean error handling middleware.
* **CORS Configured:** Secure cross-origin resource sharing configured for production frontend origins.

---

## 🛠️ Tech Stack

* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB (via MongoDB Atlas)
* **ODM:** Mongoose
* **Deployment:** Render

---

## 📡 API Reference

### Vehicle Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/car` | Retrieve all listed vehicles |
| `GET` | `/api/car/:id` | Fetch specific vehicle details by ID |
| `GET` | `/api/car/filter?q=filterType` | Filter vehicle listings |
| `POST` | `/admin/api/car` | Create a new vehicle listing |
| `PUT` | `/admin/api/car/:id/update` | Update an existing vehicle record |
| `DELETE` | `/api/cars/car` | Remove a listing from inventory |
| `POST` | `admin/api/upload` | Upload the images to cloud |
| `GET` | `/admin/api/car/sold` | Retrieve list of all sold cars |
| `GET` | `/admin/users` | Retrieve list of all registered users |
| `POST` | `/user/register` | Register new user |
| `POST` | `/user/auth` | Authorize user |
| `GET` | `/user/activate/:actStr` | Authorize user |
| `GET` | `/user/wishlist` | Get user's wish list |
| `POST` | `/user/wishlist` | Add vehicle to user's wish list |


---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB Atlas account or local MongoDB instance

### Installation & Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/inNetMedia/car-dealer-api.git
   cd car-dealer-backend

2. **Install dependencies:**
   ```bash
   npm install

3. **Environment Setup:**
   ```bash
   DATABASE_URI=your_mongodb_connectin_string
   ACCESS_TOKEN_SECRET=access_token_string
   ACCESS_TOKEN_SECRET=refresh_token_string
   RESEND_API_KEY=resend_api_key
   CLOUDINARY_URL=cloudinary_api_key

4. **Run the server:**
   ```bash
   npm run dev