const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const passport = require("passport");
const User = require("../models/User");
const { signAccess, signRefresh, verifyRefresh } = require("../utils/generateToken");
const { sendEmail } = require("../utils/sendEmail");

const cookieOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

// POST /api/auth/signup
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("name, email and password are required");
  }
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    res.status(400);
    throw new Error("Email already registered");
  }
  const user = await User.create({ name, email, password });
  const token = signAccess(user._id);
  const refreshToken = signRefresh(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("token", token, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .status(201)
    .json({
      success: true,
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }
  const token = signAccess(user._id);
  const refreshToken = signRefresh(user._id);
  user.refreshToken = refreshToken;
  await user.save();

  res
    .cookie("token", token, { ...cookieOpts, maxAge: 7 * 24 * 60 * 60 * 1000 })
    .json({
      success: true,
      token,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOpts);
  res.json({ success: true, message: "Logged out" });
});

// POST /api/auth/refresh-token
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400);
    throw new Error("refreshToken required");
  }
  let decoded;
  try {
    decoded = verifyRefresh(refreshToken);
  } catch {
    res.status(401);
    throw new Error("Invalid refresh token");
  }
  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== refreshToken) {
    res.status(401);
    throw new Error("Refresh token revoked");
  }
  const token = signAccess(user._id);
  res.json({ success: true, token });
});

// POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    // do not leak existence
    return res.json({ success: true, message: "If that email exists, a reset link has been sent." });
  }
  const raw = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(raw).digest("hex");
  user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 min
  await user.save();

  const link = `${process.env.CLIENT_URL}/reset-password?token=${raw}`;
  await sendEmail({
    to: user.email,
    subject: "Reset your ZingBazaar password",
    html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password (valid 30 min):</p><p><a href="${link}">${link}</a></p>`,
  });

  res.json({ success: true, message: "Reset link sent if account exists." });
});

// POST /api/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400);
    throw new Error("token and password required");
  }
  const hashed = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired token");
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  res.json({ success: true, message: "Password reset successful" });
});

// GET /api/auth/google
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false,
});

// GET /api/auth/google/callback
exports.googleCallback = [
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  asyncHandler(async (req, res) => {
    const user = req.user;
    const token = signAccess(user._id);
    const refreshToken = signRefresh(user._id);
    user.refreshToken = refreshToken;
    await user.save();
    const redirect = `${process.env.CLIENT_URL}/auth/callback?token=${token}&refresh=${refreshToken}`;
    res.redirect(redirect);
  }),
];

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});
