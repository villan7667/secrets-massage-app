document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeFormValidation()
  initializeRippleEffects()
  console.log("SecretsHub initialized!")
})

// --- Navigation ---
function initializeNavigation() {
  const toggle = document.getElementById("menu-toggle")
  const navLinks = document.getElementById("nav-links")
  const navbar = document.querySelector(".navbar")

  if (toggle && navLinks) {
    toggle.addEventListener("click", (e) => {
      navLinks.classList.toggle("show")
      toggle.classList.toggle("active")
      createRipple(toggle, e)
    })

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("show")
        toggle.classList.remove("active")
      })
    })

    document.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("show")
        toggle.classList.remove("active")
      }
    })
  }

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 50)
    })
  }
}

// ------ Background Effects -----
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
      
      const shootingStar = document.createElement("div")
      shootingStar.className = "shooting-star"

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

      setTimeout(() => {
        if (shootingStar.parentNode) {
          shootingStar.parentNode.removeChild(shootingStar)
        }
      }, 2000)
    }
  }, 3000)
  
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

 // ----- particle animation ----
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
}
// --- Form Validation---
function initializeFormValidation() {
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    form.addEventListener("submit", function () {
      const btn = this.querySelector('button[type="submit"]')
      if (btn) showLoadingState(btn)
    })
  })

  const passwordInput = document.getElementById("password")
  const confirmPasswordInput = document.getElementById("confirmPassword")

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      updatePasswordRequirements(passwordInput.value)
      if (confirmPasswordInput?.value) checkPasswordMatch()
    })
  }

  if (confirmPasswordInput) {
    confirmPasswordInput.addEventListener("input", checkPasswordMatch)
  }
}

function updatePasswordRequirements(password) {
  const reqs = [
    { id: "req-length", regex: /.{8,}/ },
    { id: "req-uppercase", regex: /[A-Z]/ },
    { id: "req-lowercase", regex: /[a-z]/ },
    { id: "req-number", regex: /\d/ },
    { id: "req-special", regex: /[!@#$%^&*(),.?":{}|<>]/ },
  ]
  reqs.forEach((r) => {
    const el = document.getElementById(r.id)
    if (el) el.classList.toggle("valid", r.regex.test(password))
  })
}

function checkPasswordMatch() {
  const p = document.getElementById("password")?.value
  const c = document.getElementById("confirmPassword")?.value
  const match = document.getElementById("passwordMatch")
  if (match) {
    match.style.display = c ? "flex" : "none"
    match.textContent = p === c ? " Passwords match" : " Passwords do not match"
  }
}

function showLoadingState(button) {
  button.disabled = true
  button.textContent = "Loading..."
}

// --- Ripple Effect ---
function initializeRippleEffects() {
  document.querySelectorAll(".btn, button, .nav-link").forEach((el) => {
    el.addEventListener("click", (e) => createRipple(el, e))
  })
}

function createRipple(el, e) {
  const ripple = document.createElement("span")
  const rect = el.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  ripple.style.cssText = `
    position:absolute;width:${size}px;height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    background:rgba(255,255,255,0.3);
    border-radius:50%;transform:scale(0);
    animation:ripple 0.6s linear;pointer-events:none;
  `
  el.style.position = "relative"
  el.style.overflow = "hidden"
  el.appendChild(ripple)
  setTimeout(() => ripple.remove(), 600)
}

if (!document.querySelector("#ripple-style")) {
  const style = document.createElement("style")
  style.id = "ripple-style"
  style.textContent = `
    @keyframes ripple { to { transform:scale(4); opacity:0; } }
  `
  document.head.appendChild(style)
}

// --- Auto-hide messages ---
setTimeout(() => {
  document.querySelectorAll(".error-message, .success-message").forEach((msg) => {
    msg.style.opacity = "0"
    setTimeout(() => msg.remove(), 300)
  })
}, 5000)

