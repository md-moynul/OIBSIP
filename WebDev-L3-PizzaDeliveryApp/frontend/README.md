# 🍕 PizzaPoint — Frontend

A modern, full-stack pizza ordering e-commerce platform built with **Next.js 16** and **React 19**. PizzaPoint lets customers browse a pizza menu, customize sizes, manage their cart, and checkout via Stripe — while giving admins a powerful dashboard to manage inventory and users.

> **Live Site:** Deployed on [Vercel](https://vercel.com)  
> **Backend Repo:** [pizzapoint-server](../pizzapoint-server)

---

## ✨ Features

### 🛒 Customer-Facing

- **Home Page** — Hero section, category showcase, service highlights, most-loved pizzas, statistics, testimonials, FAQ, newsletter signup, and CTA
- **Menu Browser** — Search by name, filter by category and price range, paginated grid of pizza cards
- **Pizza Detail** — View full pizza info with a size selector (6″ Small → 18″ XX-Large), dynamic pricing, and add-to-cart
- **Shopping Cart** — View items, adjust quantities (increase/decrease), remove individual items, clear cart
- **Stripe Checkout** — Secure payment processing via Stripe checkout sessions
- **Success Page** — Post-payment confirmation

### 🔐 Authentication

- **Email & Password** — Traditional sign up / sign in
- **Google OAuth** — One-click social login
- **JWT Sessions** — Secure, cookie-cached JWT strategy with 7-day expiry
- **Role-Based Access** — `user` and `admin` roles with server-side guards

### 📊 Admin Dashboard

- **Overview** — Stat cards (users, pizzas, orders, revenue) with bar chart visualization
- **Item Management** — Full CRUD table for pizza menu items (add, edit, delete)
- **User Management** — View all registered users
- **Orders / Inventory / Alerts** — Placeholder pages for future expansion

### 👤 User Dashboard

- **Cart Page** — Manage cart items with quantity controls
- **Pizza Builder** — Custom pizza builder (coming soon)
- **Profile** — User profile management

---

## 🛠 Tech Stack

| Category        | Technology                                       |
| --------------- | ------------------------------------------------ |
| Framework       | [Next.js 16](https://nextjs.org) (App Router)    |
| UI              | [React 19](https://react.dev)                    |
| Component Lib   | [HeroUI](https://heroui.com) (formerly NextUI)   |
| Styling         | [Tailwind CSS v4](https://tailwindcss.com)        |
| Auth            | [Better Auth](https://better-auth.com) (JWT)     |
| Payments        | [Stripe](https://stripe.com)                     |
| Charts          | [Recharts](https://recharts.org)                 |
| Icons           | [Gravity UI Icons](https://gravity-ui.com/icons) |
| Notifications   | [React Toastify](https://fkhadra.github.io/react-toastify/) |
| Language        | TypeScript                                       |
| Deployment      | Vercel                                           |

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout (Navbar + Footer + Toasts)
│   ├── globals.css               # Global styles
│   ├── menu/
│   │   ├── page.tsx              # Menu browser (search, filter, paginate)
│   │   └── [id]/                 # Single pizza detail + purchase panel
│   ├── auth/
│   │   ├── signin/               # Sign in page
│   │   └── signup/               # Sign up page
│   ├── checkout/                 # Stripe checkout page
│   ├── success/                  # Payment success page
│   ├── dashboard/
│   │   ├── layout.tsx            # Dashboard layout with sidebar
│   │   ├── admin/                # Admin: overview, items, users, orders, inventory, alerts
│   │   ├── user/                 # User: cart, pizza builder
│   │   └── profile/              # User profile
│   ├── api/
│   │   ├── auth/                 # Better Auth API routes
│   │   └── checkout_sessions/    # Stripe checkout session API
│   ├── about/                    # About page
│   ├── contact/                  # Contact page
│   └── unauthorized/             # 403 forbidden page
│
├── components/
│   ├── shared/                   # Navbar, Footer
│   ├── home/                     # Hero, Categories, Services, Highlights, etc.
│   ├── menu/                     # MenuBrowser, PizzaCard, PurchasePanel
│   └── dashboard/                # DashboardSidebar, ItemsTable, OverviewBarChart
│
└── lib/
    ├── auth.ts                   # Better Auth server config
    ├── auth-client.ts            # Better Auth client config
    ├── stripe.js                 # Stripe SDK instance
    ├── core/
    │   ├── server.ts             # HTTP fetch wrappers (serverFetch, protectedMutation, etc.)
    │   ├── clientToken.ts        # Get JWT from client-side session
    │   └── serverToken.ts        # Get JWT from server-side session
    ├── api/
    │   ├── pizza.ts              # Pizza read operations (getAllPizzas, getPizzaById, etc.)
    │   ├── cart.ts               # Cart read operations (getCart)
    │   └── user.ts               # User read operations (getUser)
    ├── action/
    │   ├── pizza.ts              # Pizza mutations (postPizza, deletePizza, updatePizza)
    │   └── cart.ts               # Cart mutations (addToCart, deleteCartItem, clearCart, etc.)
    ├── sessions/
    │   ├── serverSession.ts      # Server-side session + role guards
    │   └── clinetSide.ts         # Client-side session hook
    └── constants/
        └── pricing.ts            # Pizza size options & price multipliers
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root:

```env
# Better Auth
BETTER_AUTH_SECRET=<your-secret>
BETTER_AUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=<your-mongodb-connection-string>

# Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Backend Server URL
NEXT_PUBLIC_BASE_URL=http://localhost:5000

# Stripe
STRIPE_SECRET_KEY=<your-stripe-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<your-stripe-publishable-key>
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Stripe account (for payments)
- Google Cloud Console project (for OAuth)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd pizzapoint

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual values

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

| Script          | Command           | Description                  |
| --------------- | ----------------- | ---------------------------- |
| `dev`           | `npm run dev`     | Start development server     |
| `build`         | `npm run build`   | Create production build      |
| `start`         | `npm run start`   | Start production server      |
| `lint`          | `npm run lint`    | Run ESLint                   |

---

## 🏗 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Pages (SSR)  │  │  Components  │  │  Auth Client │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────┴─────────────────┴──────────────────┴───────┐  │
│  │              lib/ (API + Actions + Core)           │  │
│  │  serverFetch (reads) │ protectedMutation (writes)  │  │
│  └──────────────────────┼────────────────────────────┘  │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP + Bearer JWT
┌─────────────────────────┼───────────────────────────────┐
│              Express Backend (port 5000)                │
│  ┌──────────────────────┼───────────────────────────┐   │
│  │     verifyToken (JWKS-based JWT validation)      │   │
│  └──────────────────────┼───────────────────────────┘   │
│                         │                               │
│  ┌──────────────────────┴───────────────────────────┐   │
│  │              MongoDB (pizzapoint-db)              │   │
│  │     user  │  pizza  │  cart                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

- **Server Components (reads):** Page → `lib/api/*.ts` → `serverFetch()` → Express API → MongoDB
- **Client Components (writes):** Component → `lib/action/*.ts` → `protectedMutation()` + client JWT → Express API → MongoDB
- **Auth:** Better Auth issues JWT → Backend verifies via JWKS endpoint (`/api/auth/jwks`)

---

## 🍕 Pizza Sizing & Pricing

| Size     | Inches | Multiplier | Example (base ৳200) |
| -------- | ------ | ---------- | -------------------- |
| Small    | 6″     | 1.0×       | ৳200                 |
| Medium   | 8″     | 1.25×      | ৳250                 |
| Large    | 12″    | 1.6×       | ৳320                 |
| X-Large  | 14″    | 1.9×       | ৳380                 |
| XX-Large | 18″    | 2.4×       | ৳480                 |

---

## 📝 License

This project is private and not licensed for public distribution.
