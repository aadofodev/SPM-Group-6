import { useState } from 'react';

export default function RoomCard({ room, onBook }) {
  const available = room.status === 'available';

  const [showForm, setShowForm] = useState(false);
  const [startTime, setStartTime] = useState('');
  const [endTime,   setEndTime]   = useState('');
  const [booking,   setBooking]   = useState(false);
  const [bookError, setBookError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!startTime || !endTime) {
      setBookError('Both start and end times are required.');
      return;
    }
    if (new Date(endTime) <= new Date(startTime)) {
      setBookError('End time must be after start time.');
      return;
    }
    setBooking(true);
    setBookError('');
    try {
      await onBook(room._id, startTime, endTime);
      setShowForm(false);
      setStartTime('');
      setEndTime('');
    } catch (err) {
      setBookError(err.response?.data?.message || err.message || 'Booking failed.');
    } finally {
      setBooking(false);
    }
  }

  function handleCancel() {
    setShowForm(false);
    setStartTime('');
    setEndTime('');
    setBookError('');
  }

  return (
    <div style={{ ...s.card, borderTop: `3px solid ${available ? '#16a34a' : '#dc2626'}` }}>
      <div style={s.header}>
        <span style={s.name}>{room.name}</span>
        <span style={{ ...s.badge, ...(available ? s.badgeGreen : s.badgeRed) }}>
          {available ? 'Available' : 'Occupied'}
        </span>
      </div>
      <p style={s.location}>{room.location}</p>
      <div style={s.footer}>
        <span style={s.capacity}>
          <CapacityIcon />
          {room.capacity} {room.capacity === 1 ? 'person' : 'people'}
        </span>
      </div>

      {available && !showForm && (
        <button style={s.bookBtn} onClick={() => setShowForm(true)}>
          Book Now
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={s.form}>
          <label style={s.label}>Start</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            style={s.input}
            required
          />
          <label style={s.label}>End</label>
          <input
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            style={s.input}
            required
          />
          {bookError && <p style={s.error}>{bookError}</p>}
          <div style={s.formActions}>
            <button type="button" onClick={handleCancel} style={s.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={booking} style={s.confirmBtn}>
              {booking ? 'Booking…' : 'Confirm'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function CapacityIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ marginRight: 4, verticalAlign: 'middle' }}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

const s = {
  card: {
    background: '#fff',
    borderRadius: 10,
    padding: '1.1rem 1.25rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  header: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  name:     { fontWeight: 700, fontSize: '1rem', color: '#1e293b' },
  badge:    {
    fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem',
    borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  badgeGreen: { background: '#dcfce7', color: '#15803d' },
  badgeRed:   { background: '#fee2e2', color: '#b91c1c' },
  location:   { margin: 0, fontSize: '0.83rem', color: '#64748b' },
  footer:     { marginTop: '0.25rem' },
  capacity:   {
    display: 'inline-flex', alignItems: 'center',
    fontSize: '0.82rem', color: '#94a3b8',
  },
  bookBtn: {
    marginTop: '0.5rem',
    padding: '0.45rem 1rem',
    background: '#3b5bdb', color: '#fff',
    border: 'none', borderRadius: 7,
    fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  form: {
    marginTop: '0.5rem',
    display: 'flex', flexDirection: 'column', gap: '0.35rem',
  },
  label: { fontSize: '0.78rem', fontWeight: 600, color: '#64748b' },
  input: {
    padding: '0.4rem 0.6rem', borderRadius: 6,
    border: '1px solid #e2e8f0', fontSize: '0.82rem',
    width: '100%', boxSizing: 'border-box',
  },
  error: { margin: '0.1rem 0', fontSize: '0.8rem', color: '#dc2626' },
  formActions: { display: 'flex', gap: '0.5rem', marginTop: '0.25rem' },
  cancelBtn: {
    flex: 1, padding: '0.4rem',
    border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
    borderRadius: 6, fontSize: '0.82rem', cursor: 'pointer',
  },
  confirmBtn: {
    flex: 1, padding: '0.4rem',
    border: 'none', background: '#3b5bdb', color: '#fff',
    borderRadius: 6, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
  },
};
