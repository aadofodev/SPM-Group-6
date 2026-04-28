const express = require('express');
const Room    = require('../models/Room');
const Booking = require('../models/Booking');
const auth    = require('../middleware/auth');

const router = express.Router();

// GET /api/rooms
router.get('/', auth, async (req, res) => {
  const rooms = await Room.find().sort({ name: 1 });
  res.json(rooms);
});

// POST /api/rooms/:id/book
router.post('/:id/book', auth, async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ message: 'Room not found' });
  if (room.status !== 'available') {
    return res.status(400).json({ message: 'Room is already occupied' });
  }

  const { startTime, endTime } = req.body;
  if (!startTime || !endTime) {
    return res.status(400).json({ message: 'startTime and endTime are required' });
  }

  const booking = await Booking.create({
    room:      room._id,
    bookedBy:  req.user.email,
    startTime: new Date(startTime),
    endTime:   new Date(endTime),
  });

  room.status = 'occupied';
  await room.save();

  res.json({ room, booking });
});

module.exports = router;
