const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room:             { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bookedBy:         { type: String, required: true },
  bookedByName:     { type: String, default: '' },
  startTime:        { type: Date, required: true },
  endTime:          { type: Date, required: true },
  invitedPartner:   {
    email: { type: String, default: '' },
    name:  { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
