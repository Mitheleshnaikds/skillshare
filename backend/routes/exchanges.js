const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get matching skills for logged-in user
router.get('/matches', auth, async (req, res) => {
  try {
    const me = await User.findById(req.user);
    if (!me) return res.status(404).json({ msg: 'User not found' });

    // Find users who offer skills that the current user wants
    const matches = await User.find({
      _id: { $ne: me._id }, // exclude self
      skillsOffered: { $in: me.skillsWanted },
    }).select('name skillsOffered skillsWanted');

    res.json(matches);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
