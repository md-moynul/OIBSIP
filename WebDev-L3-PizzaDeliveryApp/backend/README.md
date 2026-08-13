# 🍕 PizzaPoint — Backend Server

The REST API backend for PizzaPoint, built with **Express 5** and **MongoDB**. Handles pizza CRUD, shopping cart management, and JWT-based authentication via JWKS verification.

> **Frontend Repo:** [pizzapoint](../pizzapoint)

---

## ✨ Features

- **Pizza Management** — Full CRUD (Create, Read, Update, Delete) for pizza items
- **Menu Browsing** — Paginated listing with search and filter (name, category, price range)
- **Shopping Cart** — Per-user cart with item merging, quantity controls, and total price recalculation
- **JWT Authentication** — Verifies tokens against the frontend's JWKS endpoint using JOSE
- **User Authorization** — Token-based user identity extraction for cart ownership validation
- **Vercel Deployment** — Configured for serverless deployment

---

## 🛠 Tech Stack

| Category   | Technology                                     |
| ---------- | ---------------------------------------------- |
| Framework  | [Express 5](https://expressjs.com)             |
| Database   | [MongoDB](https://mongodb.com) (native driver) |
| Auth       | [JOSE](https://github.com/nicolo-ribaudo/jose-cjs) (JWKS JWT verification) |
| Language   | TypeScript                                     |
| Dev Server | ts-node-dev                                    |
| Deployment | Vercel (serverless)                            |

---

## 📁 Project Structure

```
pizzapoint-server/
├── src/
│   └── index.ts             # Main server — all routes, middleware, DB connection
├── dist/                    # Compiled JavaScript output
├── package.json
├── tsconfig.json
├── vercel.json              # Vercel serverless config
├── .env                     # Environment variables
└── .gitignore
```

---

## 📡 API Endpoints

### Pizza Routes

| Method   | Endpoint               | Auth   | Description                                       |
| -------- | ---------------------- | ------ | ------------------------------------------------- |
| `GET`    | `/api/pizza/all`       | Public | Get all pizzas (no pagination)                    |
| `GET`    | `/api/pizza`           | Public | Paginated list with search & filter               |
| `GET`    | `/api/pizza/loved`     | Public | "Most loved" pizzas (paginated)                   |
| `GET`    | `/api/pizza/:id`       | Public | Get single pizza by ID                            |
| `POST`   | `/api/pizza/admin/add` | 🔒 JWT | Add a new pizza                                   |
| `PATCH`  | `/api/pizza/:id`       | 🔒 JWT | Update a pizza                                    |
| `DELETE` | `/api/pizza/:id`       | 🔒 JWT | Delete a pizza                                    |

#### Query Parameters for `GET /api/pizza`

| Param      | Type   | Default | Description                    |
| ---------- | ------ | ------- | ------------------------------ |
| `q`        | string | —       | Search pizza name (regex)      |
| `category` | string | —       | Filter by category             |
| `minPrice` | string | —       | Minimum price filter           |
| `maxPrice` | string | —       | Maximum price filter           |
| `page`     | number | `1`     | Page number                    |
| `limit`    | number | `8`     | Items per page                 |

### Cart Routes

| Method   | Endpoint                                              | Auth   | Description                      |
| -------- | ----------------------------------------------------- | ------ | -------------------------------- |
| `GET`    | `/api/cart/get/:userId`                               | Public | Get user's cart                  |
| `POST`   | `/api/cart/add`                                       | 🔒 JWT | Add items to cart (create/merge) |
| `DELETE` | `/api/cart/delete/:userId/:pizzaId/:size`             | 🔒 JWT | Remove specific item from cart   |
| `DELETE` | `/api/cart/clear/:userId`                             | 🔒 JWT | Clear entire cart                |
| `PATCH`  | `/api/cart/update-quantity/:userId/:pizzaId/:size/:action` | 🔒 JWT | Increase or decrease quantity    |

### User Routes

| Method | Endpoint     | Auth   | Description     |
| ------ | ------------ | ------ | --------------- |
| `GET`  | `/api/users` | 🔒 JWT | List all users  |

### Health Check

| Method | Endpoint | Description        |
| ------ | -------- | ------------------ |
| `GET`  | `/`      | Server status ping |

---

## 🔐 Authentication Flow

```
Frontend (Better Auth)          Backend (Express)
        │                              │
        │  1. User logs in             │
        │  2. JWT issued               │
        │                              │
        │── HTTP Request ──────────────│
        │   Authorization: Bearer <jwt>│
        │                              │
        │                    3. Extract token from header
        │                    4. Fetch JWKS from frontend
        │                       GET <CLIENT_URL>/api/auth/jwks
        │                    5. Verify JWT signature
        │                    6. Extract user ID from payload.sub
        │                    7. Process request
        │                              │
        │◄── Response ─────────────────│
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB connection string
MONGO_URI=<your-mongodb-connection-string>

# Server port
PORT=5000

# Frontend URL (for JWKS endpoint)
CLIENT_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Frontend running (for JWKS auth)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pizzapoint-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run the development server
npm run dev
```

Server starts on [http://localhost:5000](http://localhost:5000).

### Available Scripts

| Script         | Command              | Description                           |
| -------------- | -------------------- | ------------------------------------- |
| `dev`          | `npm run dev`        | Start dev server with hot reload      |
| `build`        | `npm run build`      | Compile TypeScript to `dist/`         |
| `start`        | `npm run start`      | Run compiled production build         |
| `vercel-build` | `npm run vercel-build` | Build step for Vercel deployment     |

---

## 🗄 Database Schema

### Collection: `pizza`

```json
{
  "_id": "ObjectId",
  "name": "Pepperoni Supreme",
  "category": "classic",
  "price": 250,
  "description": "Loaded with pepperoni...",
  "image": "https://..."
}
```

### Collection: `cart`

```json
{
  "_id": "ObjectId",
  "userId": "user-id-from-jwt",
  "items": [
    {
      "pizzaId": "pizza-object-id",
      "size": "Large",
      "inches": 12,
      "unitPrice": 400,
      "quantity": 2
    }
  ],
  "totalPrice": 800,
  "createdAt": "2026-08-01T00:00:00Z",
  "updatedAt": "2026-08-01T00:00:00Z"
}
```

### Collection: `user`

Managed by Better Auth on the frontend side. Queried here for admin dashboard stats.

---

## 📝 License

This project is private and not licensed for public distribution.
