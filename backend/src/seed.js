require('dotenv').config();
const mongoose = require('mongoose');
const User    = require('./models/User');
const Room    = require('./models/Room');
const Booking = require('./models/Booking');

const students = [
  {
    name: 'Alice Chen',
    email: 'alice@uni.edu',
    password: 'password123',
    subjects: ['Mathematics', 'Physics', 'Computer Science'],
    availability: ['Mon AM', 'Wed PM', 'Fri AM'],
  },
  {
    name: 'Bob Marley',
    email: 'bob@uni.edu',
    password: 'password123',
    subjects: ['Computer Science', 'Statistics', 'Economics'],
    availability: ['Tue AM', 'Wed PM', 'Thu AM'],
  },
  {
    name: 'Clara Diaz',
    email: 'clara@uni.edu',
    password: 'password123',
    subjects: ['Biology', 'Chemistry', 'Mathematics'],
    availability: ['Mon AM', 'Mon PM', 'Fri AM'],
  },
  {
    name: 'David Kim',
    email: 'david@uni.edu',
    password: 'password123',
    subjects: ['Physics', 'Computer Science', 'Statistics'],
    availability: ['Tue AM', 'Thu AM', 'Fri AM'],
  },
  {
    name: 'Eva Rossi',
    email: 'eva@uni.edu',
    password: 'password123',
    subjects: ['Literature', 'Economics', 'Chemistry'],
    availability: ['Mon PM', 'Wed PM', 'Thu AM'],
  },
];

const rooms = [
  { name: 'Room A1', capacity: 2,  location: 'Library, Floor 1', status: 'available' },
  { name: 'Room A2', capacity: 4,  location: 'Library, Floor 1', status: 'available' },
  { name: 'Room B1', capacity: 6,  location: 'Library, Floor 2', status: 'available' },
  { name: 'Room B2', capacity: 4,  location: 'Library, Floor 2', status: 'available' },
  { name: 'Room C1', capacity: 8,  location: 'Science Block',    status: 'available' },
  { name: 'Room C2', capacity: 2,  location: 'Science Block',    status: 'available' },
  { name: 'Room D1', capacity: 10, location: 'Engineering Hub',  status: 'available' },
  { name: 'Room D2', capacity: 6,  location: 'Engineering Hub',  status: 'available' },
  { name: 'Room E1', capacity: 4,  location: 'Arts Centre',      status: 'available' },
  { name: 'Room E2', capacity: 8,  location: 'Arts Centre',      status: 'available' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Booking.deleteMany({});
  console.log('✅ Cleared all bookings');

  await User.deleteMany({});
  await User.create(students);
  console.log('✅ Seeded 5 test students');

  await Room.deleteMany({});
  await Room.create(rooms);
  console.log('✅ Seeded 10 study rooms (all available)');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
