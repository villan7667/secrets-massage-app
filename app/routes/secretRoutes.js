const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middlewares/auth");
const secrets = require("../controllers/secretController");

// Secrets list
router.get("/secrets", secrets.getSecrets);

// Submit
router.get("/submit", ensureAuthenticated, secrets.getSubmit);
router.post("/submit", ensureAuthenticated, secrets.postSubmit);

// Edit
router.get("/edit/:id", ensureAuthenticated, secrets.getEdit);
router.put("/edit/:id", ensureAuthenticated, secrets.updateSecret);

// Delete
router.delete("/delete/:id", ensureAuthenticated, secrets.deleteSecret);

module.exports = router;
