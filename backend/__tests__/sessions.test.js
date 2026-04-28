process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const jwt     = require('jsonwebtoken');

jest.mock('../src/models/User', () => ({
  findOne:          jest.fn(),
  findOneAndUpdate: jest.fn(),
}));
jest.mock('../src/models/Room', () => ({
  findById: jest.fn(),
  find:     jest.fn(),
}));
jest.mock('../src/models/Booking', () => ({
  find:   jest.fn(),
  create: jest.fn(),
}));

const app  = require('../src/app');
const User = require('../src/models/User');

const token = jwt.sign({ email: 'test@uni.edu' }, 'test-secret');

describe('POST /api/sessions/log', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns 400 if durationMinutes <= 30', async () => {
    const res = await request(app)
      .post('/api/sessions/log')
      .set('Authorization', `Bearer ${token}`)
      .send({ durationMinutes: 30 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBeDefined();
  });

  it('returns 400 if durationMinutes is 0', async () => {
    const res = await request(app)
      .post('/api/sessions/log')
      .set('Authorization', `Bearer ${token}`)
      .send({ durationMinutes: 0 });

    expect(res.status).toBe(400);
  });

  it('correctly increments gamificationData and awards First Step badge', async () => {
    const mockUser = {
      gamificationData: {
        totalHoursStudied: 0,
        totalSessionsCompleted: 0,
        earnedBadges: [],
        weeklyHours: 0,
      },
      markModified: jest.fn(),
      save: jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app)
      .post('/api/sessions/log')
      .set('Authorization', `Bearer ${token}`)
      .send({ durationMinutes: 60 });

    expect(res.status).toBe(200);
    expect(mockUser.gamificationData.totalSessionsCompleted).toBe(1);
    expect(mockUser.gamificationData.totalHoursStudied).toBeCloseTo(1);
    expect(mockUser.gamificationData.weeklyHours).toBeCloseTo(1);
    expect(mockUser.gamificationData.earnedBadges).toContain('First Step');
    expect(mockUser.markModified).toHaveBeenCalledWith('gamificationData');
    expect(mockUser.save).toHaveBeenCalled();
  });
});
