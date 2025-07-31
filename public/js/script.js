// villan7667
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeTheme()

  initializeGalaxyEffects()
  initializeFormValidation()

  initializeAnimations()
  initializeCounters()
  initializeRippleEffects()

  console.log("🌟 SecretsHub initialized successfully!")
})

// Navigation with Mobile Support
function initializeNavigation() {
  const toggle = document.getElementById("menu-toggle")
  const navLinks = document.getElementById("nav-links")

  const navbar = document.querySelector(".navbar")

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      navLinks.classList.toggle("show")
      toggle.classList.toggle("active")


      createRipple(toggle, event)
    })

    // Close menu when clicking on links
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show")

        toggle.classList.remove("active")
      })
    })

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("show")

        toggle.classList.remove("active")
      }
    })
  }

  // Navbar scroll effect
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  }
}

// Theme System
function initializeTheme() {
  const themeToggle = document.getElementById("toggleTheme")
  const body = document.body

  if (!themeToggle) return

 
  const currentTheme = localStorage.getItem("secretshub-theme") || "dark"
  applyTheme(currentTheme)

  themeToggle.addEventListener("click", (e) => {
    e.preventDefault()
    createRipple(themeToggle, e)

    const newTheme = body.classList.contains("light") ? "dark" : "light"
    applyTheme(newTheme)
    localStorage.setItem("secretshub-theme", newTheme)

   //theme transition effect
    body.style.transition = "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
    setTimeout(() => {
      body.style.transition = ""
    }, 500)
  })

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light")
      themeToggle.querySelector(".theme-icon").textContent = "☀️"

      themeToggle.setAttribute("title", "Switch to Dark Mode")

    } else {
      body.classList.remove("light")

      themeToggle.querySelector(".theme-icon").textContent = "🌙"

      themeToggle.setAttribute("title", "Switch to Light Mode")

    }
  }
}

// Galaxy Background Effects
function initializeGalaxyEffects() {
  createShootingStars()
  createFloatingParticles()
  addParallaxEffect()
}

function createShootingStars() {
  const galaxyBg = document.querySelector(".galaxy-background")
  if (!galaxyBg) return

  setInterval(() => {
    if (Math.random() < 0.3) {
      // 30% chance every interval
      const shootingStar = document.createElement("div")
      shootingStar.className = "shooting-star"

      // Random starting position
      const startX = Math.random() * window.innerWidth
      const startY = Math.random() * (window.innerHeight * 0.5)

      shootingStar.style.cssText = `
        position: absolute;
        left: ${startX}px;
        top: ${startY}px;
        width: 2px;
        height: 2px;
        background: 
        linear-gradient(45deg, #ffffff, #87ceeb);
        border-radius: 50%;
        box-shadow: 0 0 10px #87ceeb;
        animation: shootingStar 2s linear forwards;
        z-index: 1;
      `

      galaxyBg.appendChild(shootingStar)

      // Remove after animation
      setTimeout(() => {
        if (shootingStar.parentNode) {
          shootingStar.parentNode.removeChild(shootingStar)
        }
      }, 2000)
    }
  }, 3000)

 //shooting star animation to CSS
  if (!document.querySelector("#shooting-star-styles")) {
    const style = document.createElement("style")
    style.id = "shooting-star-styles"
    style.textContent = `
      @keyframes shootingStar {
        0% {
          transform: translateX(0) 
          translateY(0) scale(1);
          opacity: 1;
        }
        70% {
          opacity: 1;
        }
        100% {
          transform: translateX(300px) translateY(300px) scale(0);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

function createFloatingParticles() {
  const galaxyBg = document.querySelector(".galaxy-background")
  if (!galaxyBg) return

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement("div")
    particle.className = "floating-particle"

    const size = Math.random() * 4 + 1
    const x = Math.random() * window.innerWidth
    const y = Math.random() * window.innerHeight
    const duration = Math.random() * 20 + 10
    const delay = Math.random() * 5

    particle.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, #87ceeb, transparent);
      border-radius: 50%;
      animation: floatParticle ${duration}s ${delay}s infinite linear;
      opacity: 0.6;
      z-index: 1;
    `

    galaxyBg.appendChild(particle)
  }

 //floating particle animation
  if (!document.querySelector("#particle-styles")) {
    const style = document.createElement("style")
    style.id = "particle-styles"
    style.textContent = `
      @keyframes floatParticle {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 0.6;
        }
        90% {
          opacity: 0.6;
        }
        100% {
          transform: 
          translateY(-100vh) rotate(360deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}

function addParallaxEffect() {
  const starsLayers = document.querySelectorAll("[class*='stars-layer']")

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5

    starsLayers.forEach((layer, index) => {
      const speed = (index + 1) * 0.2
      layer.style.transform = `translateY(${rate * speed}px)`
    })
  })

  // Mouse parallax effect
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth
    const mouseY = e.clientY / window.innerHeight

    starsLayers.forEach((layer, index) => {
      const speed = (index + 1) * 10
      const x = (mouseX - 0.5) * speed
      const y = (mouseY - 0.5) * speed

      layer.style.transform += ` translate(${x}px, ${y}px)`
    })
  })
}

// Form Validation
function initializeFormValidation() {
  const forms = document.querySelectorAll("form")

  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input, textarea")

    inputs.forEach((input) => {
      // Real-time validation
      input.addEventListener("input", () => validateField(input))
      input.addEventListener("blur", () => validateField(input))

      // Focus effects
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
        addInputGlow(this)
      })

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused")
        }
        removeInputGlow(this)
      })
    })

    // Form submission
    form.addEventListener("submit", function (e) {
      const submitBtn = this.querySelector('button[type="submit"]')
      if (submitBtn && !submitBtn.disabled) {
        showLoadingState(submitBtn)
      }
    })
  })

  // Password requirements for registration
  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      updatePasswordRequirements(passwordInput.value)
      if (confirmPasswordInput && confirmPasswordInput.value) {
        checkPasswordMatch()
      }
    })

    passwordInput.addEventListener("focus", () => {
      const requirements = document.getElementById("passwordRequirements")
      if (requirements) {
        requirements.style.display = "block"
        requirements.style.animation = "slideInDown 0.3s ease-out"
      }
    })
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", checkPasswordMatch)
  }

  // Password toggle functionality
  document.querySelectorAll(".password-toggle").forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const input = this.parentElement.querySelector("input")
      const icon = this.querySelector(".toggle-icon")

      if (input.type === "password") {
        input.type = "text"
        
      } else {
        input.type = "password"
        
      }

     //toggle animation
      this.style.transform = "scale(0.9)"
      setTimeout(() => {
        this.style.transform = "scale(1)"
      }, 150)
    })
  })

  // Character counter for textareas
  const textareas = document.querySelectorAll("textarea[maxlength]")
  textareas.forEach((textarea) => {
    const counter = document.getElementById("charCount")
    if (counter) {
      textarea.addEventListener("input", () => {
        const count = textarea.value.length
        const max = textarea.getAttribute("maxlength")
        counter.textContent = count

        // Color coding
        if (count > max * 0.9) {
          counter.style.color = "#ef4444"
        } else if (count > max * 0.7) {
          counter.style.color = "#f59e0b"
        } else {
          counter.style.color = "#94a3b8"
        }
      })
    }
  })
}

function validateField(field) {
  const value = field.value.trim()
  const fieldType = field.type
  const fieldName = field.name

  // Remove existing error
  const existingError = field.parentElement.querySelector(".field-error")
  if (existingError) {
    existingError.remove()
  }

  let isValid = true
  let errorMessage = ""

  // Validation rules
  if (fieldType === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      isValid = false
      errorMessage = "Please enter a valid email address"
    }
  }

  if (fieldName === "password" && value) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/
    if (!passwordRegex.test(value)) {
      isValid = false
      errorMessage = "Password must meet all requirements"
    }
  }

  if (fieldName === "username" && value && value.length < 3) {
    isValid = false
    errorMessage = "Username must be at least 3 characters"
  }

  // Show error if invalid
  if (!isValid) {
    showFieldError(field, errorMessage)
    field.style.borderColor = "#ef4444"
    field.style.boxShadow = "0 0 0 3px rgba(239, 68, 68, 0.1)"
  } else {
    field.style.borderColor = "rgba(255, 255, 255, 0.2)"
    field.style.boxShadow = ""
  }

  // Update submit button state
  updateSubmitButton()

  return isValid
}

function showFieldError(field, message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "field-error"
  errorDiv.style.cssText = `
    color: #ef4444;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: slideInDown 0.3s ease-out;
  `
  errorDiv.innerHTML = `<span>⚠️</span>${message}`

  field.parentElement.appendChild(errorDiv)
}

function updatePasswordRequirements(password) {
  const requirements = [
    { id: "req-length", regex: /.{8,}/, text: "At least 8 characters" },
    { id: "req-uppercase", regex: /[A-Z]/, text: "One uppercase letter" },
    { id: "req-lowercase", regex: /[a-z]/, text: "One lowercase letter" },
    { id: "req-number", regex: /\d/, text: "One number" },
    { id: "req-special", regex: /[!@#$%^&*(),.?":{}|<>]/, text: "One special character" },
  ]

  requirements.forEach((req) => {
    const element = document.getElementById(req.id)
    if (element) {
      const isValid = req.regex.test(password)
      const icon = element.querySelector(".req-icon")

      if (isValid) {
        element.classList.add("valid")
        icon.textContent = "✅"
        icon.style.color = "#10b981"
      } else {
        element.classList.remove("valid")
        icon.textContent = "❌"
        icon.style.color = "#ef4444"
      }
    }
  })
}

function checkPasswordMatch() {
  const password = document.getElementById("password")
  const confirmPassword = document.getElementById("confirmPassword")
  const matchIndicator = document.getElementById("passwordMatch")

  if (!password || !confirmPassword || !matchIndicator) return

  const isMatch = password.value === confirmPassword.value
  const icon = matchIndicator.querySelector(".match-icon")
  const text = matchIndicator.querySelector(".match-text")

  if (confirmPassword.value) {
    matchIndicator.style.display = "flex"

    if (isMatch) {
      matchIndicator.classList.add("valid")
      icon.textContent = "✅"
      icon.style.color = "#10b981"
      text.textContent = "Passwords match"
      text.style.color = "#10b981"
    } else {
      matchIndicator.classList.remove("valid")
      icon.textContent = "❌"
      icon.style.color = "#ef4444"
      text.textContent = "Passwords do not match"
      text.style.color = "#ef4444"
    }
  } else {
    matchIndicator.style.display = "none"
  }
}

function updateSubmitButton() {
  const submitBtn = document.querySelector('button[type="submit"]')
  if (!submitBtn) return

  const form = submitBtn.closest("form")
  const requiredFields = form.querySelectorAll("input[required], textarea[required]")
  const errors = form.querySelectorAll(".field-error")

  let allValid = true

  requiredFields.forEach((field) => {
    if (!field.value.trim()) {
      allValid = false
    }
  })

  if (errors.length > 0) {
    allValid = false
  }

  // Special check for password confirmation
  const password = form.querySelector("#password")
  const confirmPassword = form.querySelector("#confirmPassword")
  if (password && confirmPassword) {
    if (password.value !== confirmPassword.value) {
      allValid = false
    }
  }

  submitBtn.disabled = !allValid

  if (allValid) {
    submitBtn.style.opacity = "1"
    submitBtn.style.cursor = "pointer"
  } else {
    submitBtn.style.opacity = "0.6"
    submitBtn.style.cursor = "not-allowed"
  }
}

function addInputGlow(input) {
  input.style.boxShadow = "0 0 20px rgba(103, 232, 249, 0.3)"
}

function removeInputGlow(input) {
  if (!input.matches(":focus")) {
    input.style.boxShadow = ""
  }
}

function showLoadingState(button) {
  const loadingSpan = button.querySelector(".btn-loading")
  const textSpan = button.querySelector(".btn-text")

  if (loadingSpan && textSpan) {
    textSpan.style.display = "none"
    loadingSpan.style.display = "flex"
    button.disabled = true
  }
}

// Animations
function initializeAnimations() {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = Math.random() * 0.5 + "s"
        entry.target.classList.add("animate-in")

       //stagger effect for grids
        if (
          entry.target.parentElement.classList.contains("secrets-grid") ||
          entry.target.parentElement.classList.contains("features-grid")
        ) {
          const siblings = Array.from(entry.target.parentElement.children)
          const index = siblings.indexOf(entry.target)
          entry.target.style.animationDelay = index * 0.1 + "s"
        }
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".secret-card, .feature-card, .stat-item").forEach((el) => {
    observer.observe(el)
  })

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

 //hover effects to cards
  document.querySelectorAll(".secret-card, .feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px) scale(1.02)"
      this.style.boxShadow = "0 20px 40px rgba(103, 232, 249, 0.2)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0) scale(1)"
      this.style.boxShadow = ""
    })
  })
}

// Counter Animation
function initializeCounters() {
  const counters = document.querySelectorAll("[data-count]")

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        counterObserver.unobserve(entry.target)
      }
    })
  })

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

function animateCounter(element) {
  const target = Number.parseInt(element.getAttribute("data-count"))
  const duration = 2000
  const step = target / (duration / 16)
  let current = 0

  const timer = setInterval(() => {
    current += step
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString()
  }, 16)
}

// Ripple Effects
function initializeRippleEffects() {
  document.querySelectorAll(".btn, button, .nav-link").forEach((element) => {
    element.addEventListener("click", function (e) {
      createRipple(this, e)
    })
  })
}

function createRipple(element, event) {
  const ripple = document.createElement("span")
  const rect = element.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: scale(0);
    animation: ripple-effect 0.6s linear;
    pointer-events: none;
    z-index: 1000;
  `

  element.style.position = "relative"
  element.style.overflow = "hidden"
  element.appendChild(ripple)

  setTimeout(() => {
    if (ripple.parentNode) {
      ripple.parentNode.removeChild(ripple)
    }
  }, 600)
}

// Add ripple animation to CSS
if (!document.querySelector("#ripple-styles")) {
  const style = document.createElement("style")
  style.id = "ripple-styles"
  style.textContent = `
    @keyframes ripple-effect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    .animate-in {
      animation: fadeInUp 0.8s ease-out forwards;
    }
  `
  document.head.appendChild(style)
}

// Auto-hide messages
setTimeout(() => {
  const messages = document.querySelectorAll(".error-message, .success-message")
  messages.forEach((message) => {
    if (message.style.position !== "fixed") {
      message.style.animation = "slideOutUp 0.3s ease-in forwards"
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message)
        }
      }, 300)
    }
  })
}, 5000)

// Page transition effect
window.addEventListener("beforeunload", () => {
  document.body.style.opacity = "0.8"
  document.body.style.transition = "opacity 0.3s ease"
})

// Performance optimization
window.addEventListener("load", () => {
  // Remove loading states
  document.body.classList.add("loaded")

  // Lazy load images
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
})

// Error handling
window.addEventListener("error", (e) => {
  console.error("SecretsHub Error:", e.error)
})

// Service Worker registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}
