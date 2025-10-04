const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const Message = require("../models/Message");
const User = require("../models/User");
const mongoose = require("mongoose");

// Send a message
router.post("/", auth, async (req, res) => {
  try {
    const { to, text } = req.body;
    const message = new Message({ from: req.user, to, text });
    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/inbox", auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user);

    const chats = await Message.aggregate([
      { $match: { $or: [{ from: userId }, { to: userId }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$from", userId] }, "$to", "$from"] },
          lastMessage: { $first: "$text" },
          lastMessageAt: { $first: "$createdAt" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          userId: "$user._id",
          name: "$user.name",
          lastMessage: 1,
          lastMessageAt: 1
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);

    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


   // Get conversation with a user
router.get("/:userId", auth, async (req, res) => {
  try {
    const userId = req.params.userId;
    const me = req.user;

    const messages = await Message.find({
      $or: [
        { from: me, to: userId },
        { from: userId, to: me },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
