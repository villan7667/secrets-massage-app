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

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/secretsHub")
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(" DB Connection Error:", err));

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "Our-Super-Secret-Key-2024",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./app/routes/authRoutes"));
app.use("/", require("./app/routes/secretRoutes"));

// Error $ Handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res
    .status(500)
    .render("error", { title: "Error", error: "Something went wrong!" });
});
app.use((req, res) => {
  res
    .status(404)
    .render("error", { title: "Not Found", error: "Page not found!" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
