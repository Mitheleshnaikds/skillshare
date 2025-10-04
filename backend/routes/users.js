const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Update user's skills
router.put('/skills', auth, async (req, res) => {
  const { skillsOffered, skillsWanted } = req.body;
  try {
    const user = await User.findById(req.user);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user.skillsOffered = skillsOffered || user.skillsOffered;
    user.skillsWanted = skillsWanted || user.skillsWanted;

    await user.save();
    res.json({ msg: "Skills updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current user's details
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
