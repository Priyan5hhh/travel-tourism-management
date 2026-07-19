# Travel & Tourism Management System — Interview Prep Sheet

A full-stack **MERN** (MongoDB, Express, React, Node.js) web application for browsing travel tour packages, booking them, and managing everything through an admin dashboard. This document is a complete, self-contained interview preparation guide covering architecture, workflow, every feature, every file, and the trade-offs/weaknesses you should be ready to discuss.

---

## 1. Elevator Pitch (30-second summary)

> "It's a MERN-stack travel booking platform with two roles — regular users and admins. Users can browse tour packages, view details, and book a tour with their name/email. Admins get a dashboard to see stats, manage (add/delete) tour packages, and view all bookings. Auth is JWT-based with bcrypt password hashing, and the frontend is a React SPA using React Router for role-based route protection and Bootstrap for styling."

---

## 2. Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose 8** | Database & ODM (schema modeling) |
| **JWT (jsonwebtoken)** | Stateless authentication (signed tokens) |
| **bcryptjs** | Password hashing (salt rounds = 10) |
| **cors** | Cross-origin resource sharing (open, no restriction) |
| **dotenv** | Environment variable management |
| **nodemon** | Dev-time auto-restart |

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library (function components + hooks) |
| **Vite 7** | Build tool / dev server (fast HMR) |
| **React Router DOM 6** | Client-side routing + route guards |
| **Axios** | HTTP client for API calls |
| **Bootstrap 5** | CSS framework for styling/layout |
| **ESLint 9** | Linting |

### Database
- **MongoDB** (local instance: `mongodb://localhost:27017/travelDB`)
- Three collections: `users`, `tours`, `bookings`

---

## 3. Project Structure

```
travel-tourism-management/
├── backend/
│   ├── server.js                 # App entry point
│   ├── config/db.js              # Mongoose connection
│   ├── models/                   # Mongoose schemas
│   │   ├── User.js
│   │   ├── Tour.js
│   │   └── Booking.js
│   ├── controllers/              # ⚠️ NOT actually wired into routes (see §8)
│   │   ├── authController.js
│   │   ├── tourController.js
│   │   └── bookingController.js
│   ├── middleware/
│   │   └── authMiddleware.js     # ⚠️ Defined but never used anywhere (see §8)
│   ├── routes/                   # Actual route logic lives inline here
│   │   ├── authRoutes.js
│   │   ├── tourRoutes.js
│   │   ├── bookingRoutes.js
│   │   └── adminRoutes.js
│   └── .env                      # PORT, MONGO_URI, JWT_SECRET (gitignored)
└── client/
    ├── src/
    │   ├── main.jsx               # React root + Bootstrap CSS import
    │   ├── App.jsx                 # Router + route definitions
    │   ├── components/
    │   │   ├── Layout.jsx          # Navbar + footer wrapper
    │   │   ├── Navbar.jsx          # Role-aware nav bar
    │   │   └── ProtectedRoute.jsx  # UserRoute / AdminRoute guards
    │   └── pages/
    │       ├── Home.jsx            # Public tour listing + booking
    │       ├── Login.jsx
    │       ├── Register.jsx
    │       ├── TourDetails.jsx     # Single tour + booking
    │       ├── MyBookings.jsx      # User looks up bookings by email
    │       ├── Admin.jsx           # ⚠️ Orphaned/unused page (see §8)
    │       ├── AdminBookings.jsx   # Actual admin dashboard (imported as AdminDashboard)
    │       └── AddTour.jsx         # Admin form to create a tour
    └── vite.config.js
```

---

## 4. Data Models (Mongoose Schemas)

### `User` (`backend/models/User.js`)
```js
{
  name: String (required),
  email: String (required, unique),
  password: String (required, bcrypt hash),
  role: String enum ["user", "admin"], default "user"
}
```
- No `timestamps`.
- `role` drives authorization on the frontend (route guards) and can drive backend `isAdmin` middleware (though currently unused).

### `Tour` (`backend/models/Tour.js`)
```js
{
  title: String (required),
  location: String,
  price: Number (required),
  duration: String,
  description: String,
  image: String,
  itinerary: [String]
}, { timestamps: true }
```
- Only model with `timestamps: true` → gives `createdAt`/`updatedAt`.
- `location`, `duration`, `itinerary` exist in the schema but are **never populated by the UI** (AddTour.jsx only sends `title, description, price, image`) — schema is ahead of the UI.

### `Booking` (`backend/models/Booking.js`)
```js
{
  tourId: ObjectId (ref: "Tour", required),
  userName: String (required),
  userEmail: String (required),
  bookingDate: Date, default Date.now
}
```
- No `userId` reference (bookings are matched to a user purely by **email string**, not a real foreign key to `User`).
- No `status` field (pending/confirmed/cancelled) even though `Admin.jsx` (the unused page) tries to render `b.status`.

---

## 5. API Endpoints (REST)

Base URL: `http://localhost:5000/api`

### Auth — `/api/auth` (`authRoutes.js` → `authController.js`)
| Method | Path | Body | Behavior |
|---|---|---|---|
| POST | `/register` | `{name, email, password, role}` | Checks duplicate email → hashes password (bcrypt, 10 rounds) → saves user |
| POST | `/login` | `{email, password}` | Verifies password with `bcrypt.compare` → signs JWT `{id, email, role}` with 1-day expiry → returns `{token, role, name}` |

### Tours — `/api/tours` (`tourRoutes.js`, logic **inline**, not using `tourController.js`)
| Method | Path | Auth | Behavior |
|---|---|---|---|
| GET | `/` | none | Returns all tours |
| GET | `/:id` | none | Returns single tour or 404 |
| POST | `/` | none ⚠️ | Validates `title/description/price` present → creates tour |
| DELETE | `/:id` | none ⚠️ | Deletes tour by id |

### Bookings — `/api/bookings` (`bookingRoutes.js`, inline logic)
| Method | Path | Auth | Behavior |
|---|---|---|---|
| POST | `/` | none | Validates `tourId/userName/userEmail` → creates booking |
| GET | `/` | none | Returns all bookings, populated with `tourId` |
| GET | `/user/:email` | none | Returns bookings filtered by `userEmail`, populated with `tourId` |

### Admin — `/api/admin` (`adminRoutes.js`)
| Method | Path | Auth | Behavior |
|---|---|---|---|
| GET | `/stats` | none ⚠️ | `{totalUsers, totalBookings, totalTours}` via `countDocuments()` |
| GET | `/users` | none ⚠️ | All users, password field excluded via projection `"-password"` |
| GET | `/bookings` | none ⚠️ | All bookings populated with `tourId` |

⚠️ = should be protected by `verifyToken`/`isAdmin` middleware but currently is **not** (see §8 — Known Issues).

---

## 6. Authentication & Authorization Flow

1. **Register**: `POST /api/auth/register` → password hashed with `bcrypt.hash(password, 10)` → stored in Mongo.
2. **Login**: `POST /api/auth/login` → password compared with `bcrypt.compare` → on success, a JWT is signed with payload `{id, email, role}` and `JWT_SECRET`, expiring in `1d`.
3. **Client storage**: token, role, and name are saved in **`localStorage`** (not cookies).
4. **Route protection (frontend only)**: `ProtectedRoute.jsx` exports `UserRoute` and `AdminRoute` wrapper components that read `localStorage` and redirect to `/login` via `<Navigate>` if the token/role don't match.
5. **Route protection (backend)**: `authMiddleware.js` defines `verifyToken` (validates JWT from `Authorization: Bearer <token>` header) and `isAdmin` (checks `req.user.role === "admin"`) — **but no route in the app currently applies these middlewares**. This means all admin/tour-mutation endpoints are reachable by anyone who knows the URL, regardless of login state.
6. **Logout**: `Navbar.jsx` calls `localStorage.clear()` and navigates to `/login`.

**Interview talking point:** This is a classic example of "frontend-only" authorization — the UI hides buttons/routes from non-admins, but the API itself doesn't enforce it. You should be ready to explain how you'd fix it (wire `verifyToken`/`isAdmin` into `adminRoutes.js` and the mutating `tourRoutes.js` endpoints) and why relying on hidden UI elements is not real security.

---

## 7. Frontend Application Flow

### Routing (`App.jsx`)
Uses `react-router-dom` v6 `BrowserRouter`. All routes are wrapped in a shared `Layout` (Navbar + content + footer).

| Path | Component | Access |
|---|---|---|
| `/` | `Home` | Public |
| `/login` | `Login` | Public |
| `/register` | `Register` | Public |
| `/tour/:id` | `TourDetails` | Public |
| `/mybookings` | `MyBookings` | `UserRoute` (role === "user") |
| `/admin/dashboard` | `AdminBookings` (imported as `AdminDashboard`) | `AdminRoute` (role === "admin") |
| `/admin/addtour` | `AddTour` | `AdminRoute` |

### Key User Journeys
1. **Browse & Book (guest→user)**
   - `Home.jsx` fetches `GET /api/tours` on mount, renders a Bootstrap card grid.
   - Clicking **Book Now** without a token → `alert` + redirect to `/login`.
   - Logged in → `window.prompt()` collects the email → `POST /api/bookings` with `{tourId, userName (from localStorage), userEmail}`.
   - `TourDetails.jsx` (`/tour/:id`) offers a similar flow but prompts for **both** name and email (doesn't rely on localStorage name), then posts the same booking payload and redirects home.

2. **Register/Login**
   - `Register.jsx`: controlled form → `POST /api/auth/register` → alert → redirect to `/login`.
   - `Login.jsx`: controlled form → `POST /api/auth/login` → stores `token/role/name` in localStorage → redirects to `/admin/dashboard` if admin, else `/`.

3. **My Bookings** (`MyBookings.jsx`)
   - Not tied to the logged-in user's identity — it's a **manual email-search form**. User types an email and the app calls `GET /api/bookings/user/:email`, rendering a table (tour title, price, date) via Mongoose `.populate("tourId")`.

4. **Admin Dashboard** (`AdminBookings.jsx`, mounted at `/admin/dashboard`)
   - Tabbed UI (`useState` for `tab`: `home | tours | bookings`) — no nested routing, just conditional rendering.
   - On mount, fires 3 parallel requests via `Promise.all`: `GET /api/tours`, `GET /api/bookings`, `GET /api/admin/stats`.
   - **Home tab**: 3 stat cards (Total Tours / Bookings / Users) using Bootstrap `bg-primary/success/warning` cards.
   - **Manage Tours tab**: table of all tours with a **Delete** button → `window.confirm` → `DELETE /api/tours/:id` → refetches all data.
   - **View Bookings tab**: table of all bookings (user name/email/tour/price/date).

5. **Add Tour** (`AddTour.jsx`, `/admin/addtour`)
   - Controlled form (`title, description, price, image`) → `POST /api/tours` → alert success/failure → resets form.

### Components
- **`Layout.jsx`**: Wraps every page with `Navbar` + `<main>` + a footer showing the current year (`{new Date().getFullYear()}`).
- **`Navbar.jsx`**: Reads `token/role/name` straight from `localStorage` on every render (not React state/context — so it won't reactively update without a full navigation/re-render). Conditionally shows Login/Register vs. My Bookings vs. Admin links vs. Logout button based on role.
- **`ProtectedRoute.jsx`**: Two small guard components (`UserRoute`, `AdminRoute`) — simplest possible pattern for role-gated routes in React Router v6, using `<Navigate to="/login" />`.

---

## 8. Known Issues / Weaknesses (great "what would you improve" talking points)

This is a learning/portfolio project with some rough edges — being able to identify and explain these shows strong engineering judgment in an interview.

1. **No backend authorization enforcement.** `authMiddleware.js` (`verifyToken`, `isAdmin`) is fully implemented but **never imported or applied** to any route. `adminRoutes.js`, and the tour-mutating endpoints (`POST/DELETE /api/tours`), are open to anyone. Fix: apply `router.use(verifyToken, isAdmin)` on admin routes and mutation routes.

2. **Orphaned/dead code.**
   - `controllers/tourController.js` and `controllers/bookingController.js` are never imported by any route file — the actual route files (`tourRoutes.js`, `bookingRoutes.js`) implement the logic **inline** instead. The controllers reference fields that don't even match the real schema (e.g., `bookingController.js` queries `Booking.find({userId})` and `.populate("packageId")`, but the `Booking` model has no `userId` or `packageId` fields — only `tourId`).
   - `pages/Admin.jsx` is a full component that's never routed anywhere in `App.jsx` (the real dashboard is `AdminBookings.jsx`, aliased as `AdminDashboard`). `Admin.jsx` also calls endpoints (`/api/admin/users`) and expects fields (`b.packageId`, `b.travelDate`, `b.status`) that don't exist on the current `Booking` schema — it appears to be an earlier draft of the dashboard.

3. **JWT stored in `localStorage`.** Vulnerable to XSS token theft (vs. an httpOnly cookie). Standard interview discussion point: trade-off between localStorage (simple, but XSS-exposed) vs. httpOnly cookies (needs CSRF protection, more setup).

4. **Booking identity is just an email string**, not a real relation to the logged-in `User` document. `MyBookings.jsx` doesn't even use the logged-in user's session — it's a public "type your email to see your bookings" form, meaning **anyone can view anyone else's bookings** just by knowing their email (an IDOR-style data exposure).

5. **No booking-time authentication check** — `POST /api/bookings` doesn't verify the requester is logged in or matches `userEmail`; it's called directly from `Home.jsx`/`TourDetails.jsx` without an `Authorization` header at all.

6. **CORS is wide open** (`app.use(cors())` with no options) — acceptable for local dev, but would need an allow-list in production.

7. **Hardcoded API base URL** (`http://localhost:5000`) is duplicated across **every** page component instead of being centralized in an `.env`/config file or an Axios instance (`axios.create({baseURL})`). Makes deployment to a real host require find-and-replace across many files.

8. **No global Express error-handling middleware** — every route handler duplicates its own `try/catch` + `res.status(500)`, and some pass raw `error` objects into JSON responses (e.g., `res.json({message:"...", error})`), which can leak stack details.

9. **No input validation library** (e.g., Joi/Zod/express-validator) — validation is manual `if (!field)` checks, and there's no email format/password strength validation on register.

10. **No inventory/capacity management** — a `Tour` has no `seatsAvailable`/`capacity` field, so bookings can be created indefinitely with no overbooking protection.

11. **Schema/UI mismatch on `Tour`** — the schema supports `location`, `duration`, and `itinerary` (array), but `AddTour.jsx` only collects `title/description/price/image`, so those fields are always empty in practice.

12. **`Navbar.jsx` reads `localStorage` directly** rather than through React Context/state — after login/logout the Navbar only updates because `navigate()` causes a re-render tied to the route change, not because of reactive state. Works, but isn't idiomatic React (no global auth context/provider).

13. **Passwords/roles are self-assigned at registration** (`role` comes straight from the register request body in `authController.js`) — a malicious client could `POST /api/auth/register` with `role: "admin"` and self-promote, since there's no server-side restriction on who can register as admin.

---

## 9. Likely Interview Questions & How to Answer

**Q: Walk me through what happens when a user books a tour.**
A: On `Home.jsx`, clicking "Book Now" checks for a token in localStorage; if missing, redirects to login. If present, it prompts for the user's email, then POSTs `{tourId, userName, userEmail}` to `/api/bookings`. The Express route (`bookingRoutes.js`) validates the three fields exist, creates a `Booking` document referencing the `Tour` by ObjectId, and returns it. No auth header is actually sent or checked server-side.

**Q: How is a user authenticated, and how would you improve it?**
A: JWT signed on login with a 1-day expiry, stored in localStorage. I'd improve it by (a) actually applying the existing `verifyToken`/`isAdmin` middleware to protected routes — right now it's written but unused — and (b) considering httpOnly cookies to reduce XSS exposure, with CSRF protection added.

**Q: How are admin and regular users differentiated?**
A: A `role` enum field (`user`/`admin`) on the `User` model, embedded into the JWT payload at login, then read from `localStorage` on the frontend to conditionally render nav links and gate routes via `ProtectedRoute.jsx`'s `UserRoute`/`AdminRoute`. This is UI-level only right now — there's no server-side role check enforced.

**Q: Why did you choose MERN / this architecture?**
A: MongoDB's document model suits loosely structured tour data (arrays like itinerary, optional fields); Mongoose gives schema validation + easy `.populate()` for joining bookings to tours; Express keeps the API layer minimal and unopinionated; React + Vite gives a fast SPA dev experience; Bootstrap was chosen for rapid, consistent styling without writing custom CSS.

**Q: What would you do differently / what's the biggest gap?**
A: Enforce authorization server-side (currently the biggest gap — admin routes and tour mutation routes have no auth middleware applied despite it being implemented), and tie bookings to the authenticated user's ID instead of a free-text email lookup, which is currently a data-exposure risk (anyone can see anyone's bookings by guessing their email).

**Q: How would you scale/deploy this?**
A: Move the hardcoded `http://localhost:5000` calls into a single Axios instance with an env-driven `baseURL` (e.g., Vite's `import.meta.env.VITE_API_URL`), deploy the Express API (e.g., Render/Railway) with MongoDB Atlas instead of local Mongo, deploy the Vite build as static assets (Netlify/Vercel), and add centralized error-handling middleware plus real request validation.

---

## 10. How to Run Locally

**Backend**
```bash
cd backend
npm install
npm start          # nodemon server.js — runs on PORT from .env (default 5000)
```
Requires a local MongoDB instance running at `mongodb://localhost:27017/travelDB` (or update `MONGO_URI` in `.env`).

**Frontend**
```bash
cd client
npm install
npm run dev         # Vite dev server, default http://localhost:5173
```

**Environment variables** (`backend/.env`, not committed — see `.gitignore`):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelDB
JWT_SECRET=<your-secret>
```

---

## 11. Quick-Reference Cheat Sheet

- **Stack**: React 18 + Vite + Bootstrap 5 (frontend) / Node + Express 5 + MongoDB + Mongoose 8 (backend)
- **Auth**: JWT (1-day expiry) + bcrypt (10 salt rounds), role field (`user`/`admin`)
- **State management**: Local component state only (`useState`) + `localStorage` for session — no Redux/Context
- **Routing**: React Router v6, 7 routes, 2 custom route guards
- **Collections**: `users`, `tours`, `bookings`
- **Relationships**: `Booking.tourId` → `Tour` (populated); no relation from `Booking` to `User`
- **Biggest interview-worthy flaw**: backend authorization middleware exists but is unused — all mutation/admin endpoints are effectively public
