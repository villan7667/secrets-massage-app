// Enhanced Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("toggleTheme")
    const body = document.body
    const navbar = document.querySelector(".navbar")
  
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem("theme") || "light"
  
    // Apply saved theme on load
    if (currentTheme === "dark") {
      body.classList.add("dark")
      if (themeToggle) themeToggle.textContent = "☀️"
    } else {
      body.classList.remove("dark")
      if (themeToggle) themeToggle.textContent = "🌙"
    }
  
    // Theme toggle event listener with smooth transition
    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.preventDefault()
  
        // Add transition class for smooth change
        body.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
  
        body.classList.toggle("dark")
  
        if (body.classList.contains("dark")) {
          localStorage.setItem("theme", "dark")
          themeToggle.textContent = "☀️"
          themeToggle.setAttribute("title", "Switch to Light Mode")
        } else {
          localStorage.setItem("theme", "light")
          themeToggle.textContent = "🌙"
          themeToggle.setAttribute("title", "Switch to Dark Mode")
        }
  
        // Remove transition after change
        setTimeout(() => {
          body.style.transition = ""
        }, 400)
      })
    }
  
    // Navbar scroll effect
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  
    // Create floating particles
    createParticles()
  
    // Form animations
    initFormAnimations()
  
    // Secret cards animations
    initSecretAnimations()
  })
  
  // Create floating particles
  function createParticles() {
    const particlesContainer = document.createElement("div")
    particlesContainer.className = "particles"
    document.body.appendChild(particlesContainer)
  
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.animationDelay = Math.random() * 10 + "s"
      particle.style.animationDuration = Math.random() * 3 + 3 + "s"
      particlesContainer.appendChild(particle)
    }
  }
  
  // Form animations and validation
  function initFormAnimations() {
    const inputs = document.querySelectorAll("input, textarea")
  
    inputs.forEach((input) => {
      // Focus animations
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
      })
  
      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused")
        }
      })
  
      // Real-time validation
      input.addEventListener("input", function () {
        validateField(this)
      })
    })
  
    // Form submission with loading state
    const forms = document.querySelectorAll("form")
    forms.forEach((form) => {
      form.addEventListener("submit", function (e) {
        const submitBtn = this.querySelector('button[type="submit"]')
        if (submitBtn) {
          submitBtn.innerHTML = '<span class="loading"></span> Processing...'
          submitBtn.disabled = true
        }
      })
    })
  }
  
  // Field validation
  function validateField(field) {
    const value = field.value.trim()
    const fieldType = field.type
    const fieldName = field.name
  
    // Remove existing error messages
    const existingError = field.parentElement.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }
  
    let isValid = true
    let errorMessage = ""
  
    // Validation rules
    if (fieldType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }
  
    if (fieldName === "password" && value.length > 0 && value.length < 6) {
      isValid = false
      errorMessage = "Password must be at least 6 characters long"
    }
  
    if (fieldName === "username" && value.length > 0 && value.length < 3) {
      isValid = false
      errorMessage = "Username must be at least 3 characters long"
    }
  
    // Show error message
    if (!isValid) {
      const errorDiv = document.createElement("div")
      errorDiv.className = "error-message"
      errorDiv.style.color = "#ef4444"
      errorDiv.style.fontSize = "0.8rem"
      errorDiv.style.marginTop = "0.25rem"
      errorDiv.textContent = errorMessage
      field.parentElement.appendChild(errorDiv)
  
      field.style.borderColor = "#ef4444"
    } else {
      field.style.borderColor = "rgba(255, 255, 255, 0.2)"
    }
  
    return isValid
  }
  
  // Secret cards animations
  function initSecretAnimations() {
    const secretCards = document.querySelectorAll(".secret-card")
  
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animationDelay = Math.random() * 0.5 + "s"
            entry.target.classList.add("animate-in")
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
  
    secretCards.forEach((card) => {
      observer.observe(card)
  
      // Add hover effects
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)"
      })
  
      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)"
      })
    })
  }
  
  // Smooth scrolling for anchor links
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
  
  // Add ripple effect to buttons
  function addRippleEffect() {
    const buttons = document.querySelectorAll(".btn, button")
  
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span")
        const rect = this.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2
  
        ripple.style.width = ripple.style.height = size + "px"
        ripple.style.left = x + "px"
        ripple.style.top = y + "px"
        ripple.classList.add("ripple")
  
        this.appendChild(ripple)
  
        setTimeout(() => {
          ripple.remove()
        }, 600)
      })
    })
  }
  
  // Initialize ripple effect
  addRippleEffect()
  
  // Add CSS for ripple effect
  const rippleCSS = `
  .btn, button {
      position: relative;
      overflow: hidden;
  }
  
  .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple-animation 0.6s linear;
      pointer-events: none;
  }
  
  @keyframes ripple-animation {
      to {
          transform: scale(4);
          opacity: 0;
      }
  }
  `
  
  const style = document.createElement("style")
  style.textContent = rippleCSS
  document.head.appendChild(style)
  
  // Auto-hide messages after 5 seconds
  setTimeout(() => {
    const messages = document.querySelectorAll(".message")
    messages.forEach((message) => {
      message.style.animation = "slideOutUp 0.3s ease-in forwards"
      setTimeout(() => message.remove(), 300)
    })
  }, 5000)
  
  // Add loading animation to page transitions
  window.addEventListener("beforeunload", () => {
    document.body.style.opacity = "0.7"
    document.body.style.transition = "opacity 0.3s ease"
  })
  
