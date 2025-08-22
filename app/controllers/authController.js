const passport = require("passport");
const User = require("../models/user");

const activeUsers = new Set(); 

function validatePassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  return regex.test(password);
}

exports.getHome = (req, res) => {
  res.render("home", { title: "Home - SecretsHub", message: null });
};

exports.getRegister = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect("/secrets");
  res.render("register", { title: "Register - SecretsHub", error: null });
};

exports.postRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    if (!username || !email || !password || !confirmPassword) {
      return res.render("register", { title: "Register - SecretsHub", error: "All fields are required" });
    }
    if (username.length < 6) {
      return res.render("register", { title: "Register - SecretsHub", error: "Username must be at least 6 characters" });
    }
    if (!validatePassword(password)) {
      return res.render("register", { title: "Register - SecretsHub", error: "Weak password (upper/lower/number/special)" });
    }
    if (password !== confirmPassword) {
      return res.render("register", { title: "Register - SecretsHub", error: "Passwords do not match" });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.render("register", { title: "Register - SecretsHub", error: "User already exists" });
    }

    const newUser = new User({ username, email });
    User.register(newUser, password, (err, user) => {
      if (err) {
        console.error("Registration error:", err);
        return res.render("register", { title: "Register - SecretsHub", error: "Registration failed" });
      }
      passport.authenticate("local")(req, res, () => {
        activeUsers.add(user._id.toString());
        user.lastLogin = new Date();
        user.save();
        res.redirect("/secrets");
      });
    });
  } catch (e) {
    console.error("Register error:", e);
    res.render("register", { title: "Register - SecretsHub", error: "An error occurred" });
  }
};

exports.getLogin = (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect("/secrets");
  res.render("login", { title: "Login - SecretsHub", error: null });
};

exports.postLogin = (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      console.error("Login error:", err);
      return res.render("login", { title: "Login - SecretsHub", error: "An error occurred" });
    }
    if (!user) {
      return res.render("login", { title: "Login - SecretsHub", error: "Invalid email or password" });
    }
    if (activeUsers.has(user._id.toString())) {
      return res.render("login", { title: "Login - SecretsHub", error: "User already logged in" });
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login fail:", err);
        return res.render("login", { title: "Login - SecretsHub", error: "Login failed" });
      }
      activeUsers.add(user._id.toString());
      user.lastLogin = new Date();
      user.save();
      const redirectTo = req.session.returnTo || "/secrets";
      delete req.session.returnTo;
      res.redirect(redirectTo);
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  if (req.user) activeUsers.delete(req.user._id.toString());
  req.logout((err) => {
    if (err) console.error("Logout error:", err);
    req.session.destroy(() => res.redirect("/"));
  });
};

// Optional API your frontend can use to check password strength
exports.validatePasswordApi = (req, res) => {
  const { password = "" } = req.body || {};
  const requirements = [
    { key: "length", text: "At least 8 characters", valid: /.{8,}/.test(password) },
    { key: "upper", text: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { key: "lower", text: "One lowercase letter", valid: /[a-z]/.test(password) },
    { key: "number", text: "One number", valid: /\d/.test(password) },
    { key: "special", text: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];
  const isValid = requirements.every(r => r.valid);
  res.json({ isValid, requirements });
};
