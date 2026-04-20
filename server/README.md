# ZingBazaar Backend — Express + MongoDB

Backend API for the **ZingBazaar** frontend (ShopZone + FoodRush + StyleHub).

> ⚠️ **This server runs OUTSIDE Lovable.** Lovable's sandbox is for frontend
> only — deploy this `/server` folder to Render, Railway, Fly.io, or your own VPS.

## Stack

Node.js · Express · MongoDB (Mongoose) · JWT · Bcryptjs · Passport (Google OAuth) · Nodemailer · Multer · CORS · Helmet

## Quick start

```bash
cd server
cp .env.example .env       # then fill in real values
npm install
npm run seed               # optional — seeds products/restaurants/fashion
npm run dev                # http://localhost:5000
```

## Folder structure

```
server/
├── config/         db.js, passport.js
├── controllers/    auth, user, product, restaurant, fashion, cart, order
├── middleware/     authMiddleware, errorMiddleware, uploadMiddleware
├── models/         User, Product, Restaurant, FashionItem, Cart, Order, Coupon
├── routes/         auth, user, product, restaurant, fashion, cart, order, deals, review
├── utils/          generateToken.js, sendEmail.js
├── seed.js
├── server.js
└── .env.example
```

## Environment variables

See `.env.example`. You need:

| Var | Purpose |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Token signing |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth |
| `EMAIL_USER` / `EMAIL_PASS` | Gmail SMTP (use App Password) |
| `CLIENT_URL` | Frontend URL (for password reset & Google callback redirect) |
| `ALLOWED_ORIGINS` | Comma-separated CORS whitelist |

## API summary

### Auth — `/api/auth`
| Method | Path | Notes |
|---|---|---|
| POST | `/signup` | name, email, password → JWT + refresh |
| POST | `/login` | email, password |
| POST | `/logout` | clears cookie |
| POST | `/refresh-token` | { refreshToken } → new JWT |
| POST | `/forgot-password` | sends reset link via email |
| POST | `/reset-password` | { token, password } |
| GET  | `/google` | starts Google OAuth |
| GET  | `/google/callback` | redirects to `${CLIENT_URL}/auth/callback?token=...&refresh=...` |
| GET  | `/me` | 🔒 current user |

### User — `/api/user` (🔒 all)
`profile` (GET/PUT) · `orders` · `wishlist` (GET/POST/DELETE :id) · `wallet` · `addresses` (GET/POST/DELETE :id)

### ShopZone — `/api/products`
`/` (filters: minPrice, maxPrice, brand, rating, category, search, sort, page, limit) · `/deals` · `/category/:name` · `/:id`

### FoodRush — `/api/restaurants`
`/` (cuisine, rating, search, sort) · `/category/:type` · `/:id`

### StyleHub — `/api/fashion`
`/` (category, brand, size, color, minPrice, maxPrice, sort) · `/category/:type` · `/:id`

### Cart — `/api/cart` (🔒)
`GET /` · `POST /add` · `PUT /update` · `DELETE /remove/:id` · `DELETE /clear`

### Orders — `/api/orders` (🔒)
`POST /place` · `GET /:id` · `GET /track/:id`

### Deals — `/api/deals`
`/all` · `/today`

### Reviews — `/api/reviews` (🔒)
`POST /:kind/:id` (kind = `product` | `fashion`)

## Wiring the frontend

Replace the mock `AuthContext` and `CartContext` calls with real API calls:

```ts
// src/lib/api.ts
import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://your-api.onrender.com/api
  withCredentials: true,
});
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("zb-token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
```

Then in `AuthContext.login`:
```ts
const { data } = await api.post("/auth/login", { email, password });
localStorage.setItem("zb-token", data.token);
localStorage.setItem("zb-refresh", data.refreshToken);
persist(data.user);
```

## Deploying

**Render:** New Web Service → connect repo → Root Dir `server` → Build `npm install` → Start `npm start` → add env vars.

**Railway:** New project → Deploy from repo → set Root `server` → add env vars.

Update `ALLOWED_ORIGINS` to include your deployed frontend URL.

## Security checklist

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT 7d, refresh 30d
- ✅ Helmet headers, CORS whitelist, async error handling
- ✅ Reset tokens hashed in DB, 30 min TTL
- ⚠️ Add rate-limit middleware on `/auth/*` for production
