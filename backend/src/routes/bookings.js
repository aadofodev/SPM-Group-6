const express = require('express');
const Booking = require('../models/Booking');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings/mine
router.get('/mine', auth, async (req, res) => {
  const bookings = await Booking.find({ bookedBy: req.user.email })
    .populate('room')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

module.exports = router;
