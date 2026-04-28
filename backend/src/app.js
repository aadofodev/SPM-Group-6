const express = require('express');
const cors    = require('cors');

const authRoutes    = require('./routes/auth');
const matchRoutes   = require('./routes/matches');
const userRoutes    = require('./routes/users');
const roomRoutes    = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const sessionRoutes = require('./routes/sessions');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'UniMatch API running' }));
app.use('/api/auth',     authRoutes);
app.use('/api/matches',  matchRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sessions', sessionRoutes);

module.exports = app;
