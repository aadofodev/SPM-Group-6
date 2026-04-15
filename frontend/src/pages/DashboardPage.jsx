import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MatchCard from '../components/MatchCard';

const ALL_SUBJECTS = [
  'Mathematics', 'Physics', 'Computer Science',
  'Biology', 'Chemistry', 'Statistics', 'Economics', 'Literature',
];

const ALL_SLOTS = [
  'Mon AM', 'Mon PM', 'Tue AM', 'Tue PM',
  'Wed AM', 'Wed PM', 'Thu AM', 'Thu PM', 'Fri AM', 'Fri PM',
];

const API = 'http://localhost:5001';

export default function DashboardPage() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [selectedSubjects,  setSelectedSubjects]  = useState([]);
  const [selectedSlots,     setSelectedSlots]     = useState([]);
  const [matches,           setMatches]           = useState([]);
  const [loading,           setLoading]           = useState(false);
  const [error,             setError]             = useState('');

  const fetchMatches = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedSubjects.length) params.subjects     = selectedSubjects.join(',');
      if (selectedSlots.length)    params.availability = selectedSlots.join(',');

      const { data } = await axios.get(`${API}/api/matches`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      setMatches(data);
    } catch {
      setError('Failed to load matches.');
    } finally {
      setLoading(false);
    }
  }, [token, selectedSubjects, selectedSlots]);

  useEffect(() => { fetchMatches(); }, [fetchMatches]);

  function toggle(value, list, setList) {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={s.page}>
      {/* Top bar */}
      <header style={s.topbar}>
        <span style={s.logo}>UniMatch</span>
        <div style={s.userInfo}>
          <Link to="/dashboard" style={{ ...s.navLink, ...s.navActive }}>Matches</Link>
          <Link to="/rooms"     style={s.navLink}>Rooms</Link>
          <Link to="/settings"  style={s.navLink}>Settings</Link>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      <div style={s.layout}>
        {/* Filter panel */}
        <aside style={s.sidebar}>
          <h2 style={s.sidebarTitle}>Find a Partner</h2>

          <FilterSection
            label="Subjects"
            options={ALL_SUBJECTS}
            selected={selectedSubjects}
            onToggle={v => toggle(v, selectedSubjects, setSelectedSubjects)}
          />

          <FilterSection
            label="Availability"
            options={ALL_SLOTS}
            selected={selectedSlots}
            onToggle={v => toggle(v, selectedSlots, setSelectedSlots)}
          />

          {(selectedSubjects.length > 0 || selectedSlots.length > 0) && (
            <button
              style={s.clearBtn}
              onClick={() => { setSelectedSubjects([]); setSelectedSlots([]); }}
            >
              Clear filters
            </button>
          )}
        </aside>

        {/* Match results */}
        <main style={s.main}>
          <div style={s.resultsHeader}>
            <h2 style={s.resultsTitle}>
              {loading ? 'Searching…' : `${matches.length} match${matches.length !== 1 ? 'es' : ''} found`}
            </h2>
          </div>

          {error && <p style={s.error}>{error}</p>}

          {!loading && matches.length === 0 && !error && (
            <div style={s.empty}>
              <p>No matches for the selected filters.</p>
              <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Try broadening your criteria.</p>
            </div>
          )}

          <div style={s.grid}>
            {matches.map(m => <MatchCard key={m._id} match={m} />)}
          </div>
        </main>
      </div>
    </div>
  );
}

function FilterSection({ label, options, selected, onToggle }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={s.filterLabel}>{label}</p>
      {options.map(opt => (
        <label key={opt} style={s.checkboxRow}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
            style={{ accentColor: '#3b5bdb', marginRight: '0.5rem' }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

const s = {
  page:    { minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  topbar:  {
    background: '#3b5bdb', color: '#fff',
    padding: '0 1.5rem', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo:    { fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { fontSize: '0.9rem' },
  navLink: {
    color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
    fontSize: '0.875rem', padding: '0.3rem 0.6rem', borderRadius: 6,
  },
  navActive: { color: '#fff', background: 'rgba(255,255,255,0.15)' },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    padding: '0.35rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem',
  },
  layout:  { display: 'flex', maxWidth: 1100, margin: '0 auto', padding: '1.5rem', gap: '1.5rem' },
  sidebar: {
    width: 220, flexShrink: 0,
    background: '#fff', borderRadius: 12, padding: '1.25rem',
    boxShadow: '0 1px 8px rgba(0,0,0,0.07)', alignSelf: 'flex-start',
    position: 'sticky', top: '1.5rem',
  },
  sidebarTitle: { margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' },
  filterLabel:  { margin: '0 0 0.5rem', fontWeight: 600, fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  checkboxRow:  { display: 'flex', alignItems: 'center', fontSize: '0.875rem', color: '#334155', padding: '0.2rem 0', cursor: 'pointer' },
  clearBtn:     {
    width: '100%', padding: '0.5rem', borderRadius: 8,
    border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
    cursor: 'pointer', fontSize: '0.85rem', marginTop: '0.5rem',
  },
  main:          { flex: 1 },
  resultsHeader: { marginBottom: '1rem' },
  resultsTitle:  { margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#1e293b' },
  grid:          { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' },
  empty:         { textAlign: 'center', padding: '3rem', color: '#64748b' },
  error:         { color: '#dc2626', fontSize: '0.875rem', marginBottom: '1rem' },
};
