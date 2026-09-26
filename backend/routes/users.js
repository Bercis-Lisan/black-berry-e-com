const express = require("express");
const User = require("../models/User");

const router = express.Router();

// POST /api/users/sync — called from the frontend right after Firebase
// login or signup succeeds. Upserts so createdAt reflects the FIRST time
// we saw this uid (i.e. their signup date), while lastLoginAt updates
// every time.
router.post("/sync", async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid) {
      return res.status(400).json({ success: false, message: "uid is required" });
    }

    const user = await User.findOneAndUpdate(
      { uid },
      { $set: { email, lastLoginAt: new Date() } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("user sync error:", err);
    res.status(500).json({ success: false, message: "Could not sync user" });
  }
});

module.exports = router;
