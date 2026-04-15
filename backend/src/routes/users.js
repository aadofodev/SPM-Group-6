const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

const VALID_SUBJECTS = [
  'Mathematics', 'Physics', 'Computer Science',
  'Biology', 'Chemistry', 'Statistics', 'Economics', 'Literature',
];
const VALID_SLOTS = [
  'Mon AM', 'Mon PM', 'Tue AM', 'Tue PM',
  'Wed AM', 'Wed PM', 'Thu AM', 'Thu PM', 'Fri AM', 'Fri PM',
];

// GET /api/users/me
router.get('/me', auth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email }).select('-password');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// PUT /api/users/me/preferences
router.put('/me/preferences', auth, async (req, res) => {
  const { subjects, availability } = req.body;

  if (!Array.isArray(subjects) || !Array.isArray(availability)) {
    return res.status(400).json({ message: 'subjects and availability must be arrays' });
  }

  const badSubjects = subjects.filter(s => !VALID_SUBJECTS.includes(s));
  const badSlots    = availability.filter(a => !VALID_SLOTS.includes(a));

  if (badSubjects.length) {
    return res.status(400).json({ message: `Invalid subjects: ${badSubjects.join(', ')}` });
  }
  if (badSlots.length) {
    return res.status(400).json({ message: `Invalid availability slots: ${badSlots.join(', ')}` });
  }

  const updated = await User.findOneAndUpdate(
    { email: req.user.email },
    { subjects, availability },
    { new: true }
  ).select('-password');

  if (!updated) return res.status(404).json({ message: 'User not found' });

  res.json(updated);
});

module.exports = router;
