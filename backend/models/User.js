const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, default: null },
    lastLoginAt: { type: Date, default: Date.now },
  },
  { timestamps: true } // createdAt = first time we saw this user (signup)
);

module.exports = mongoose.model("User", userSchema);
