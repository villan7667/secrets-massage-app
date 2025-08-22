require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

// Passport Config
require("./app/config/passport")(passport);

// DB Connect
const mongoUri = process.env.MONGODB_URI ;
mongoose
  .connect(mongoUri)
  .then(() => console.log(" MongoDB connected done!"))
  .catch((err) => console.error(" MongoDB error:", err.message));

// View Static
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: process.env.SESSION_SECRET ,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use("/", require("./app/routes/authRoutes"));
app.use("/", require("./app/routes/secretRoutes"));

// Error handler `
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).render("error", {
    title: "Error - SecretsHub",
    error: "Something went wrong!",
    user: req.user || null,
  });
});

// 404 — also passes `user`
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Page Not Found - SecretsHub",
    error: "Page not found!",
    user: req.user || null,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
