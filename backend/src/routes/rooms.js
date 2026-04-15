const express = require('express');
const Room = require('../models/Room');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms
router.get('/', auth, async (req, res) => {
  const rooms = await Room.find().sort({ name: 1 });
  res.json(rooms);
});

module.exports = router;
