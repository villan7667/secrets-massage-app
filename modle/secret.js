const mongoose = require("mongoose");

const secretSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Secret", secretSchema);



// Twinkling Galaxy Background
const starContainer = document.createElement("div")
starContainer.className = "star-background"
document.body.appendChild(starContainer)

for (let i = 0; i < 100; i++) {
  const star = document.createElement("div")
  star.className = "star"
  star.style.top = Math.random() * 100 + "vh"
  star.style.left = Math.random() * 100 + "vw"
  star.style.animationDelay = Math.random() * 5 + "s"
  starContainer.appendChild(star)
}
