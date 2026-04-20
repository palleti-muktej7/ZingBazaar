require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");

const connectDB = require("./config/db");
require("./config/passport");

const { errorHandler, notFound } = require("./middleware/errorMiddleware");

const app = express();

// --- DB ---
connectDB();

// --- Security & parsing ---
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- CORS ---
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // mobile/postman
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin))
        return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(passport.initialize());

// --- Static uploads ---
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.get("/", (_req, res) =>
  res.json({ ok: true, name: "ZingBazaar API", version: "1.0.0" })
);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/fashion", require("./routes/fashionRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/deals", require("./routes/dealRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));

// --- Errors ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 ZingBazaar API running on port ${PORT}`)
);
