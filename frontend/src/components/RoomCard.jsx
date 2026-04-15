export default function RoomCard({ room }) {
  const available = room.status === 'available';

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
  name: { fontWeight: 700, fontSize: '1rem', color: '#1e293b' },
  badge: {
    fontSize: '0.72rem', fontWeight: 600, padding: '0.2rem 0.6rem',
    borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.04em',
  },
  badgeGreen: { background: '#dcfce7', color: '#15803d' },
  badgeRed:   { background: '#fee2e2', color: '#b91c1c' },
  location: { margin: 0, fontSize: '0.83rem', color: '#64748b' },
  footer:   { marginTop: '0.25rem' },
  capacity: {
    display: 'inline-flex', alignItems: 'center',
    fontSize: '0.82rem', color: '#94a3b8',
  },
};
