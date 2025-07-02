// index.js (FINAL VERSION)
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const path = require("path");

const app = express();

// --- App Config ---
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// --- Session & Passport Config ---
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// --- Mongoose Connect ---
mongoose.connect("mongodb+srv://hsgf7667:villan7667@cluster7667.h95hy.mongodb.net/secretApp");

// --- Schemas ---
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

const secretSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String
});
const Secret = mongoose.model("Secret", secretSchema);

// --- Passport Strategies ---
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// --- Routes ---

app.get("/", (req, res) => res.render("home", { user: req.user }));

app.get("/register", (req, res) => res.render("register", { user: req.user }));

app.get("/login", (req, res) => res.render("login", { user: req.user }));

app.post("/register", (req, res) => {
  User.register({ username: req.body.username }, req.body.password, (err, user) => {
    if (err) return res.redirect("/register");
    passport.authenticate("local")(req, res, () => res.redirect("/secrets"));
  });
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secrets",
  failureRedirect: "/login"
}));

app.get("/logout", (req, res) => {
  req.logout(() => res.redirect("/"));
});

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit", { user: req.user });
  } else {
    res.redirect("/login");
  }
});

app.post("/submit", async (req, res) => {
  if (req.isAuthenticated()) {
    const newSecret = new Secret({
      userId: req.user._id,
      content: req.body.secret
    });
    await newSecret.save();
    res.redirect("/secrets");
  } else {
    res.redirect("/login");
  }
});

app.get("/secrets", async (req, res) => {
  const allSecrets = await Secret.find({}).populate("userId");
  res.render("secrets", { user: req.user, secrets: allSecrets });
});

app.get("/edit/:id", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  const secret = await Secret.findById(req.params.id);
  if (!secret || !secret.userId.equals(req.user._id)) return res.redirect("/secrets");
  res.render("edit-secret", { user: req.user, secret });
});

app.post("/edit/:id", async (req, res) => {
  await Secret.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { content: req.body.secret }
  );
  res.redirect("/secrets");
});

app.post("/delete/:id", async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");
  const secret = await Secret.findById(req.params.id);
  if (!secret || !secret.userId.equals(req.user._id)) return res.redirect("/secrets");
  await Secret.findByIdAndDelete(req.params.id);
  res.redirect("/secrets");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
