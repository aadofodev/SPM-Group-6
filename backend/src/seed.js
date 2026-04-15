require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const students = [
  { name: 'Alice Chen',    email: 'alice@uni.edu',   password: 'password123' },
  { name: 'Bob Marley',    email: 'bob@uni.edu',     password: 'password123' },
  { name: 'Clara Diaz',   email: 'clara@uni.edu',   password: 'password123' },
  { name: 'David Kim',    email: 'david@uni.edu',   password: 'password123' },
  { name: 'Eva Rossi',    email: 'eva@uni.edu',     password: 'password123' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  await User.create(students);
  console.log('✅ Seeded 5 test students');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
