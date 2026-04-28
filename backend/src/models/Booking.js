const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room:      { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookedBy:  { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime:   { type: Date, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
