const express = require('express');
const Booking = require('../models/Booking');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET /api/bookings/mine
router.get('/mine', auth, async (req, res) => {
  const email = req.user.email;
  const raw = await Booking.find({
    $or: [
      { bookedBy: email },
      { 'invitedPartner.email': email },
    ],
  })
    .populate('room')
    .sort({ createdAt: -1 });

  const bookings = raw.map(b => ({
    ...b.toObject(),
    role: b.bookedBy === email ? 'organiser' : 'invited',
  }));

  res.json(bookings);
});

module.exports = router;
