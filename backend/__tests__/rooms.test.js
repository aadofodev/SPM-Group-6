process.env.JWT_SECRET = 'test-secret';

const request = require('supertest');
const jwt     = require('jsonwebtoken');

jest.mock('../src/models/Room', () => ({
  findById: jest.fn(),
  find:     jest.fn(),
}));
jest.mock('../src/models/Booking', () => ({
  find:   jest.fn(),
  create: jest.fn(),
}));
jest.mock('../src/models/User', () => ({
  findOne:          jest.fn(),
  findOneAndUpdate: jest.fn(),
}));

const app     = require('../src/app');
const Room    = require('../src/models/Room');
const Booking = require('../src/models/Booking');

const token = jwt.sign({ email: 'test@uni.edu' }, 'test-secret');

describe('POST /api/rooms/:id/book', () => {
  beforeEach(() => jest.clearAllMocks());

  it('happy path returns 200 and sets room status to occupied', async () => {
    const mockRoom = {
      _id: 'room123',
      status: 'available',
      save: jest.fn().mockResolvedValue(true),
    };
    Room.findById.mockResolvedValue(mockRoom);
    Booking.create.mockResolvedValue({
      _id: 'booking1',
      room: 'room123',
      bookedBy: 'test@uni.edu',
      startTime: new Date('2026-05-01T10:00:00Z'),
      endTime:   new Date('2026-05-01T12:00:00Z'),
    });

    const res = await request(app)
      .post('/api/rooms/room123/book')
      .set('Authorization', `Bearer ${token}`)
      .send({
        startTime: '2026-05-01T10:00:00Z',
        endTime:   '2026-05-01T12:00:00Z',
      });

    expect(res.status).toBe(200);
    expect(mockRoom.status).toBe('occupied');
    expect(mockRoom.save).toHaveBeenCalled();
    expect(res.body.room).toBeDefined();
    expect(res.body.booking).toBeDefined();
  });

  it('returns 400 if room is already occupied', async () => {
    Room.findById.mockResolvedValue({ _id: 'room123', status: 'occupied' });

    const res = await request(app)
      .post('/api/rooms/room123/book')
      .set('Authorization', `Bearer ${token}`)
      .send({
        startTime: '2026-05-01T10:00:00Z',
        endTime:   '2026-05-01T12:00:00Z',
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/occupied/i);
  });
});
