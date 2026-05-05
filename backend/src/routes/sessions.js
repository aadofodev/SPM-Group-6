const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

const BADGE_RULES = [
  { name: 'First Step',      check: g => g.totalSessionsCompleted >= 1  },
  { name: 'Getting Serious', check: g => g.totalSessionsCompleted >= 5  },
  { name: 'Top Studier',     check: g => g.totalSessionsCompleted >= 10 },
  { name: 'Marathon',        check: g => g.totalHoursStudied >= 10      },
  { name: 'Consistent',      check: g => g.weeklyHours >= 5             },
];

// POST /api/sessions/log
router.post('/log', auth, async (req, res) => {
  const { durationMinutes } = req.body;

  if (!durationMinutes || durationMinutes <= 30) {
    return res.status(400).json({ message: 'Session must be longer than 30 minutes' });
  }

  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.gamificationData) {
    user.gamificationData = {
      totalHoursStudied: 0,
      totalSessionsCompleted: 0,
      earnedBadges: [],
      weeklyHours: 0,
    };
  }

  const g = user.gamificationData;
  const hoursToAdd = durationMinutes / 60;

  const lastReset = user.gamificationData.lastWeekReset
    ? new Date(user.gamificationData.lastWeekReset)
    : new Date(0);

  if (getISOWeek(lastReset) !== getISOWeek(new Date()) ||
      lastReset.getFullYear() !== new Date().getFullYear()) {
    user.gamificationData.weeklyHours = 0;
    user.gamificationData.lastWeekReset = new Date();
  }

  g.totalHoursStudied += hoursToAdd;
  g.totalSessionsCompleted += 1;
  g.weeklyHours += hoursToAdd;

  for (const { name, check } of BADGE_RULES) {
    if (check(g) && !g.earnedBadges.includes(name)) {
      g.earnedBadges.push(name);
    }
  }

  user.markModified('gamificationData');
  await user.save();

  res.json(g);
});

module.exports = router;
