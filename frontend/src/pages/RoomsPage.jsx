import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RoomCard from '../components/RoomCard';

const API = 'http://localhost:5001';

export default function RoomsPage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [rooms,   setRooms]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    axios.get(`${API}/api/rooms`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => setRooms(data))
      .catch(() => setError('Failed to load rooms.'))
      .finally(() => setLoading(false));
  }, [token]);

  const available = rooms.filter(r => r.status === 'available');
  const occupied  = rooms.filter(r => r.status === 'occupied');

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={s.page}>
      <header style={s.topbar}>
        <span style={s.logo}>UniMatch</span>
        <div style={s.nav}>
          <Link to="/dashboard" style={s.navLink}>Matches</Link>
          <Link to="/rooms"     style={{ ...s.navLink, ...s.navActive }}>Rooms</Link>
          <Link to="/settings"  style={s.navLink}>Settings</Link>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div style={s.container}>
        <h1 style={s.title}>Study Rooms</h1>
        <p style={s.subtitle}>Browse available study spaces across campus.</p>

        {loading && <p style={s.status}>Loading rooms…</p>}
        {error   && <p style={{ ...s.status, color: '#dc2626' }}>{error}</p>}

        {!loading && !error && (
          <>
            <SummaryBar available={available.length} occupied={occupied.length} />
            <section>
              <h2 style={s.sectionTitle}>
                <GreenDot /> Available ({available.length})
              </h2>
              {available.length === 0
                ? <p style={s.empty}>No rooms currently available.</p>
                : <div style={s.grid}>{available.map(r => <RoomCard key={r._id} room={r} />)}</div>
              }
            </section>
            <section style={{ marginTop: '2rem' }}>
              <h2 style={s.sectionTitle}>
                <RedDot /> Occupied ({occupied.length})
              </h2>
              {occupied.length === 0
                ? <p style={s.empty}>No rooms currently occupied.</p>
                : <div style={s.grid}>{occupied.map(r => <RoomCard key={r._id} room={r} />)}</div>
              }
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryBar({ available, occupied }) {
  const total = available + occupied;
  const pct   = total ? Math.round((available / total) * 100) : 0;
  return (
    <div style={s.summaryBar}>
      <div style={s.summaryItem}>
        <span style={{ ...s.summaryCount, color: '#15803d' }}>{available}</span>
        <span style={s.summaryLabel}>Available</span>
      </div>
      <div style={s.summaryItem}>
        <span style={{ ...s.summaryCount, color: '#b91c1c' }}>{occupied}</span>
        <span style={s.summaryLabel}>Occupied</span>
      </div>
      <div style={s.summaryItem}>
        <span style={{ ...s.summaryCount, color: '#3b5bdb' }}>{pct}%</span>
        <span style={s.summaryLabel}>Free</span>
      </div>
    </div>
  );
}

const GreenDot = () => <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#16a34a', marginRight:8 }} />;
const RedDot   = () => <span style={{ display:'inline-block', width:10, height:10, borderRadius:'50%', background:'#dc2626', marginRight:8 }} />;

const s = {
  page:      { minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  topbar:    {
    background: '#3b5bdb', color: '#fff',
    padding: '0 1.5rem', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo:      { fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' },
  nav:       { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  navLink:   {
    color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
    fontSize: '0.875rem', padding: '0.3rem 0.6rem', borderRadius: 6,
  },
  navActive: { color: '#fff', background: 'rgba(255,255,255,0.15)' },
  userName:  { fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)', marginLeft: '0.5rem' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    padding: '0.35rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem',
  },
  container:    { maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' },
  title:        { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' },
  subtitle:     { margin: '0 0 1.5rem', color: '#64748b', fontSize: '0.95rem' },
  status:       { color: '#64748b', fontSize: '0.95rem' },
  sectionTitle: {
    display: 'flex', alignItems: 'center',
    margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600, color: '#1e293b',
  },
  grid:         { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  empty:        { color: '#94a3b8', fontSize: '0.9rem' },
  summaryBar:   {
    display: 'flex', gap: '1.5rem', marginBottom: '2rem',
    background: '#fff', borderRadius: 10, padding: '1rem 1.5rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
  },
  summaryItem:  { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  summaryCount: { fontSize: '1.5rem', fontWeight: 700 },
  summaryLabel: { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' },
};
