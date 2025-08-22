const Secret = require("../models/secret");

exports.getSecrets = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = 12;
    const skip = (page - 1) * limit;

    const total = await Secret.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / limit));

    const secrets = await Secret.find({})
      .populate("userId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.render("secrets", {
      title: "Discover Secrets - SecretsHub",
      secrets,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page + 1,
      prevPage: page - 1,
    });
  } catch (e) {
    console.error("Secrets page error:", e);
    res.render("secrets", {
      title: "Discover Secrets - SecretsHub",
      secrets: [],
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
      nextPage: 1,
      prevPage: 1,
    });
  }
};

exports.getSubmit = (req, res) => {
  res.render("submit", { title: "Share Secret - SecretsHub", error: null });
};

exports.postSubmit = async (req, res) => {
  const { secret, isAnonymous } = req.body;
  try {
    if (!secret || !secret.trim()) {
      return res.render("submit", {
        title: "Share Secret - SecretsHub",
        error: "Secret content cannot be empty",
      });
    }
    if (secret.length > 1000) {
      return res.render("submit", {
        title: "Share Secret - SecretsHub",
        error: "Secret must be less than 1000 characters",
      });
    }

    await new Secret({
      userId: req.user._id,
      content: secret.trim(),
      isAnonymous: !!isAnonymous,
    }).save();

    res.redirect("/secrets");
  } catch (e) {
    console.error("Submit error:", e);
    res.render("submit", { title: "Share Secret - SecretsHub", error: "Failed to submit secret" });
  }
};

exports.getEdit = async (req, res) => {
  try {
    const secret = await Secret.findById(req.params.id);
    if (!secret || !secret.userId.equals(req.user._id)) return res.redirect("/secrets");
    res.render("edit-secret", { title: "Edit Secret - SecretsHub", secret, error: null });
  } catch (e) {
    console.error("Edit page error:", e);
    res.redirect("/secrets");
  }
};

exports.updateSecret = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      const secret = await Secret.findById(req.params.id);
      return res.render("edit-secret", {
        title: "Edit Secret - SecretsHub",
        secret,
        error: "Secret content cannot be empty",
      });
    }
    if (content.length > 1000) {
      const secret = await Secret.findById(req.params.id);
      return res.render("edit-secret", {
        title: "Edit Secret - SecretsHub",
        secret,
        error: "Secret must be less than 1000 characters",
      });
    }

    await Secret.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { content: content.trim(), updatedAt: new Date() }
    );

    res.redirect("/secrets");
  } catch (e) {
    console.error("Update error:", e);
    res.redirect("/secrets");
  }
};

exports.deleteSecret = async (req, res) => {
  try {
    await Secret.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.redirect("/secrets");
  } catch (e) {
    console.error("Delete error:", e);
    res.redirect("/secrets");
  }
};
