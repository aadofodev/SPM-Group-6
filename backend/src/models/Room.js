const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String, required: true },
  status:   { type: String, enum: ['available', 'occupied'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
