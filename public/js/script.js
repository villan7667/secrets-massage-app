
document.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("toggleTheme")
    const body = document.body
    const navbar = document.querySelector(".navbar")
  
 
    const currentTheme = localStorage.getItem("theme") || "light"
  

    if (currentTheme === "dark") {
      body.classList.add("dark")
      if (themeToggle) themeToggle.textContent = "☀️"
    } else {
      body.classList.remove("dark")
      if (themeToggle) themeToggle.textContent = "🌙"
    }
  

    if (themeToggle) {
      themeToggle.addEventListener("click", (e) => {
        e.preventDefault()
  
        
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
  
      
        setTimeout(() => {
          body.style.transition = ""
        }, 400)
      })
    }
  
    
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }
    })
  
    
    createParticles()
  
   
    initFormAnimations()
  
   
    initSecretAnimations()
  })
  

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
  

  function initFormAnimations() {
    const inputs = document.querySelectorAll("input, textarea")
  
    inputs.forEach((input) => {
   
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused")
      })
  
      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused")
        }
      })
  

      input.addEventListener("input", function () {
        validateField(this)
      })
    })
  

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
  

  function validateField(field) {
    const value = field.value.trim()
    const fieldType = field.type
    const fieldName = field.name
  
    
    const existingError = field.parentElement.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }
  
    let isValid = true
    let errorMessage = ""
  
  
    if (fieldType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (value && !emailRegex.test(value)) {
        isValid = false
        errorMessage = "Please enter a valid email address"
      }
    }
  if (fieldName === "password" && value.length > 0) {
    // Password must be at least 8 characters, contain one uppercase, one lowercase, one digit, and one symbol
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    if (!passwordRegex.test(value)) {
    isValid = false
    errorMessage = "Password must be at least 8 characters and include uppercase, lowercase, number, and symbol"
    }
  }

  if (fieldName === "username" && value.length > 0 && value.length < 3) {
    isValid = false
    errorMessage = "Username must be at least 3 characters long"
  }
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
  

  function initSecretAnimations() {
    const secretCards = document.querySelectorAll(".secret-card")
  
   
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
  
  
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)"
      })
  
      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)"
      })
    })
  }
  

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
  

  addRippleEffect()
  

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
  

  setTimeout(() => {
    const messages = document.querySelectorAll(".message")
    messages.forEach((message) => {
      message.style.animation = "slideOutUp 0.3s ease-in forwards"
      setTimeout(() => message.remove(), 300)
    })
  }, 5000)
  

  window.addEventListener("beforeunload", () => {
    document.body.style.opacity = "0.7"
    document.body.style.transition = "opacity 0.3s ease"
  })
  
