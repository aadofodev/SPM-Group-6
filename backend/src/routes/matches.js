const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/matches?subjects=Mathematics,Physics&availability=Mon+AM,Fri+AM
router.get('/', auth, async (req, res) => {
  const { subjects, availability } = req.query;

  const subjectFilter  = subjects     ? subjects.split(',').map(s => s.trim()).filter(Boolean)     : [];
  const availFilter    = availability ? availability.split(',').map(s => s.trim()).filter(Boolean) : [];

  const query = { email: { $ne: req.user.email } };

  if (subjectFilter.length)  query.subjects     = { $in: subjectFilter };
  if (availFilter.length)    query.availability = { $in: availFilter };

  const users = await User.find(query).select('-password');

  // Annotate each match with overlap counts so the frontend can display them
  const matches = users.map(u => {
    const subjectOverlap     = subjectFilter.length
      ? u.subjects.filter(s => subjectFilter.includes(s))
      : u.subjects;
    const availabilityOverlap = availFilter.length
      ? u.availability.filter(a => availFilter.includes(a))
      : u.availability;
    return {
      _id:              u._id,
      name:             u.name,
      email:            u.email,
      subjects:         u.subjects,
      availability:     u.availability,
      subjectOverlap,
      availabilityOverlap,
    };
  });

  res.json(matches);
});

module.exports = router;
