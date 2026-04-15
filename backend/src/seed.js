require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

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

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.create(students);
  console.log('✅ Seeded 5 test students with subjects and availability');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
