const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Exchange = require('../models/Exchange');

// Get all exchanges for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [
        { teacherId: req.user },
        { studentId: req.user }
      ]
    })
    .populate('teacherId', 'name email skillsOffered')
    .populate('studentId', 'name email skillsWanted')
    .sort({ createdAt: -1 });

    res.json(exchanges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new exchange request
router.post('/', auth, async (req, res) => {
  try {
    const { teacherId, skill, scheduledAt, notes } = req.body;

    // Validate that teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher not found' });
    }

    // Create exchange
    const exchange = new Exchange({
      teacherId,
      studentId: req.user,
      skill,
      scheduledAt: scheduledAt || Date.now(),
      notes,
      status: 'pending'
    });

    await exchange.save();

    // Populate before returning
    await exchange.populate('teacherId', 'name email skillsOffered');
    await exchange.populate('studentId', 'name email skillsWanted');

    res.json(exchange);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Update exchange status
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const exchange = await Exchange.findById(req.params.id);
    
    if (!exchange) {
      return res.status(404).json({ msg: 'Exchange not found' });
    }

    // Check if user is part of this exchange
    if (exchange.teacherId.toString() !== req.user && 
        exchange.studentId.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Only teacher can accept/reject pending requests
    if ((status === 'accepted' || status === 'rejected') && exchange.status === 'pending') {
      if (exchange.teacherId.toString() !== req.user) {
        return res.status(403).json({ msg: 'Only the teacher can accept or reject this request' });
      }
    }

    // Both can mark as completed (only if already accepted)
    if (status === 'completed' && exchange.status !== 'accepted') {
      return res.status(400).json({ msg: 'Can only complete an accepted exchange' });
    }

    exchange.status = status;
    await exchange.save();

    await exchange.populate('teacherId', 'name email skillsOffered');
    await exchange.populate('studentId', 'name email skillsWanted');

    res.json(exchange);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Delete an exchange
router.delete('/:id', auth, async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);
    
    if (!exchange) {
      return res.status(404).json({ msg: 'Exchange not found' });
    }

    // Only teacher or student can delete
    if (exchange.teacherId.toString() !== req.user && 
        exchange.studentId.toString() !== req.user) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    await Exchange.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Exchange deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

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
