// Load environment variables FIRST - before any other imports
require("dotenv").config()

const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require("mongoose-findorcreate")
const methodOverride = require("method-override")
const path = require("path")
const bcrypt = require("bcrypt")

const app = express()

// Middleware setup
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride("_method"))

// Enhanced session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "Our-Super-Secret-Key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

app.use(passport.initialize())
app.use(passport.session())

// Debug: Log environment variables (remove in production)
console.log("🔍 Environment check:")
console.log("SESSION_SECRET:", process.env.SESSION_SECRET ? "✅ Loaded" : "❌ Missing")
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✅ Loaded" : "❌ Missing")
console.log("PORT:", process.env.PORT || "Using default 3000")

// Database connection with error handling
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/secretsHub"
console.log("🔗 Attempting to connect to MongoDB...")

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully")
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message)
    console.log("🔍 Troubleshooting tips:")
    console.log("1. Check if your .env file is in the project root")
    console.log("2. Verify your MongoDB URI is correct")
    console.log("3. Ensure your MongoDB cluster is running")
  })

// Enhanced User Schema with additional security
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
  isActive: {
    type: Boolean,
    default: true,
  },
})

userSchema.plugin(passportLocalMongoose, { usernameField: "email" })
userSchema.plugin(findOrCreate)

const User = mongoose.model("User", userSchema)

// Enhanced Secret Schema
const secretSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  isAnonymous: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
})

const Secret = mongoose.model("Secret", secretSchema)

// Passport configuration
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// Middleware to track active sessions
const activeUsers = new Set()

// Password validation function
function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
  return passwordRegex.test(password)
}

// Authentication middleware
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.session.returnTo = req.originalUrl
  res.redirect("/login")
}

// Routes
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
    title: "Home - SecretsHub",
    message: null,
  })
})

app.get("/register", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/secrets")
  }
  res.render("register", {
    user: req.user,
    title: "Register - SecretsHub",
    error: null,
  })
})

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/secrets")
  }
  res.render("login", {
    user: req.user,
    title: "Login - SecretsHub",
    error: null,
  })
})

// Enhanced registration with security checks
app.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body

  try {
    // Validation checks
    if (!username || !email || !password || !confirmPassword) {
      return res.render("register", {
        user: null,
        title: "Register - SecretsHub",
        error: "All fields are required",
      })
    }

    if (username.length < 3) {
      return res.render("register", {
        user: null,
        title: "Register - SecretsHub",
        error: "Username must be at least 3 characters long",
      })
    }

    if (!validatePassword(password)) {
      return res.render("register", {
        user: null,
        title: "Register - SecretsHub",
        error: "Password must be at least 8 characters with uppercase, lowercase, number, and special character",
      })
    }

    if (password !== confirmPassword) {
      return res.render("register", {
        user: null,
        title: "Register - SecretsHub",
        error: "Passwords do not match",
      })
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { username: username }],
    })

    if (existingUser) {
      return res.render("register", {
        user: null,
        title: "Register - SecretsHub",
        error: "User with this email or username already exists",
      })
    }

    // Register new user
    const newUser = new User({ username, email })

    User.register(newUser, password, (err, user) => {
      if (err) {
        console.error("Registration error:", err)
        return res.render("register", {
          user: null,
          title: "Register - SecretsHub",
          error: "Registration failed. Please try again.",
        })
      }

      passport.authenticate("local")(req, res, () => {
        activeUsers.add(user._id.toString())
        user.lastLogin = new Date()
        user.save()
        res.redirect("/secrets")
      })
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.render("register", {
      user: null,
      title: "Register - SecretsHub",
      error: "An error occurred during registration",
    })
  }
})

// Enhanced login with session management
app.post("/login", (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.render("login", {
      user: null,
      title: "Login - SecretsHub",
      error: "Email and password are required",
    })
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("Login error:", err)
      return res.render("login", {
        user: null,
        title: "Login - SecretsHub",
        error: "An error occurred during login",
      })
    }

    if (!user) {
      return res.render("login", {
        user: null,
        title: "Login - SecretsHub",
        error: "Invalid email or password",
      })
    }

    // Check if user is already logged in (prevent multiple sessions)
    if (activeUsers.has(user._id.toString())) {
      return res.render("login", {
        user: null,
        title: "Login - SecretsHub",
        error: "User is already logged in from another session",
      })
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("Login error:", err)
        return res.render("login", {
          user: null,
          title: "Login - SecretsHub",
          error: "Login failed",
        })
      }

      activeUsers.add(user._id.toString())
      user.lastLogin = new Date()
      user.save()

      const redirectTo = req.session.returnTo || "/secrets"
      delete req.session.returnTo
      res.redirect(redirectTo)
    })
  })(req, res, next)
})

// Enhanced logout
app.get("/logout", (req, res) => {
  if (req.user) {
    activeUsers.delete(req.user._id.toString())
  }

  req.logout((err) => {
    if (err) {
      console.error("Logout error:", err)
    }
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err)
      }
      res.redirect("/")
    })
  })
})

// Submit secret page
app.get("/submit", ensureAuthenticated, (req, res) => {
  res.render("submit", {
    user: req.user,
    title: "Share Secret - SecretsHub",
    error: null,
  })
})

// Submit secret with enhanced validation
app.post("/submit", ensureAuthenticated, async (req, res) => {
  const { secret, isAnonymous } = req.body

  try {
    if (!secret || secret.trim().length === 0) {
      return res.render("submit", {
        user: req.user,
        title: "Share Secret - SecretsHub",
        error: "Secret content cannot be empty",
      })
    }

    if (secret.length > 1000) {
      return res.render("submit", {
        user: req.user,
        title: "Share Secret - SecretsHub",
        error: "Secret must be less than 1000 characters",
      })
    }

    const newSecret = new Secret({
      userId: req.user._id,
      content: secret.trim(),
      isAnonymous: isAnonymous !== undefined,
    })

    await newSecret.save()
    res.redirect("/secrets")
  } catch (error) {
    console.error("Submit secret error:", error)
    res.render("submit", {
      user: req.user,
      title: "Share Secret - SecretsHub",
      error: "Failed to submit secret. Please try again.",
    })
  }
})

// View all secrets with pagination
app.get("/secrets", async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = 12
    const skip = (page - 1) * limit

    const totalSecrets = await Secret.countDocuments()
    const totalPages = Math.ceil(totalSecrets / limit)

    const allSecrets = await Secret.find({})
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    res.render("secrets", {
      user: req.user,
      title: "Discover Secrets - SecretsHub",
      secrets: allSecrets,
      currentPage: page,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
    })
  } catch (error) {
    console.error("Secrets page error:", error)
    res.render("secrets", {
      user: req.user,
      title: "Discover Secrets - SecretsHub",
      secrets: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
    })
  }
})

// Edit secret page
app.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    const secret = await Secret.findById(req.params.id)

    if (!secret) {
      return res.redirect("/secrets")
    }

    if (!secret.userId.equals(req.user._id)) {
      return res.redirect("/secrets")
    }

    res.render("edit-secret", {
      user: req.user,
      title: "Edit Secret - SecretsHub",
      secret: secret,
      error: null,
    })
  } catch (error) {
    console.error("Edit page error:", error)
    res.redirect("/secrets")
  }
})

// Update secret
app.put("/edit/:id", ensureAuthenticated, async (req, res) => {
  try {
    const { content } = req.body

    if (!content || content.trim().length === 0) {
      const secret = await Secret.findById(req.params.id)
      return res.render("edit-secret", {
        user: req.user,
        title: "Edit Secret - SecretsHub",
        secret: secret,
        error: "Secret content cannot be empty",
      })
    }

    if (content.length > 1000) {
      const secret = await Secret.findById(req.params.id)
      return res.render("edit-secret", {
        user: req.user,
        title: "Edit Secret - SecretsHub",
        secret: secret,
        error: "Secret must be less than 1000 characters",
      })
    }

    await Secret.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        content: content.trim(),
        updatedAt: new Date(),
      },
    )

    res.redirect("/secrets")
  } catch (error) {
    console.error("Update secret error:", error)
    res.redirect("/secrets")
  }
})

// Delete secret
app.delete("/delete/:id", ensureAuthenticated, async (req, res) => {
  try {
    await Secret.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    })
    res.redirect("/secrets")
  } catch (error) {
    console.error("Delete secret error:", error)
    res.redirect("/secrets")
  }
})

// API endpoint for real-time validation
app.post("/api/validate-password", (req, res) => {
  const { password } = req.body
  const isValid = validatePassword(password)

  const requirements = [
    { regex: /.{8,}/, text: "At least 8 characters", valid: /.{8,}/.test(password) },
    { regex: /[A-Z]/, text: "One uppercase letter", valid: /[A-Z]/.test(password) },
    { regex: /[a-z]/, text: "One lowercase letter", valid: /[a-z]/.test(password) },
    { regex: /\d/, text: "One number", valid: /\d/.test(password) },
    { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "One special character", valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ]

  res.json({
    isValid: isValid,
    requirements: requirements,
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err)
  res.status(500).render("error", {
    user: req.user,
    title: "Error - SecretsHub",
    error: "Something went wrong!",
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).render("error", {
    user: req.user,
    title: "Page Not Found - SecretsHub",
    error: "Page not found!",
  })
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down gracefully...")
  mongoose.connection.close(() => {
    console.log("📦 MongoDB connection closed.")
    process.exit(0)
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 SecretsHub server running on http://localhost:${PORT}`)
  console.log(`🌟 Environment: ${process.env.NODE_ENV || "development"}`)
})
