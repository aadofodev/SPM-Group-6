import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ALL_SUBJECTS = [
  'Mathematics', 'Physics', 'Computer Science',
  'Biology', 'Chemistry', 'Statistics', 'Economics', 'Literature',
];

const ALL_SLOTS = [
  'Mon AM', 'Mon PM', 'Tue AM', 'Tue PM',
  'Wed AM', 'Wed PM', 'Thu AM', 'Thu PM', 'Fri AM', 'Fri PM',
];

const ALL_BADGES = [
  {
    name: 'First Step',
    desc: 'Complete your first study session',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
  },
  {
    name: 'Getting Serious',
    desc: 'Complete 5 study sessions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="9" y1="7" x2="15" y2="7" />
        <line x1="9" y1="11" x2="15" y2="11" />
      </svg>
    ),
  },
  {
    name: 'Top Studier',
    desc: 'Complete 10 study sessions',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
      </svg>
    ),
  },
  {
    name: 'Marathon',
    desc: 'Accumulate 10+ total hours studied',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    name: 'Consistent',
    desc: 'Study 5+ hours in a single week',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" width="26" height="26">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
];

const API = 'http://localhost:5001';

export default function ProfileSettingsPage() {
  const { token, user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [subjects,         setSubjects]        = useState([]);
  const [availability,     setAvailability]    = useState([]);
  const [gamificationData, setGamificationData]= useState(null);
  const [loading,          setLoading]         = useState(true);
  const [saving,           setSaving]          = useState(false);
  const [toast,            setToast]           = useState(null);

  useEffect(() => {
    axios.get(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        setSubjects(data.subjects || []);
        setAvailability(data.availability || []);
        setGamificationData(data.gamificationData ?? {
          totalHoursStudied: 0, totalSessionsCompleted: 0,
          earnedBadges: [], weeklyHours: 0,
        });
      })
      .catch(() => showToast('error', 'Failed to load your profile.'))
      .finally(() => setLoading(false));
  }, [token]);

  function toggle(value, list, setList) {
    setList(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  }

  function showToast(type, msg) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { data } = await axios.put(
        `${API}/api/users/me/preferences`,
        { subjects, availability },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      updateUser({ subjects: data.subjects, availability: data.availability });
      showToast('success', 'Preferences saved!');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      showToast('error', err.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={s.page}>
      <header style={s.topbar}>
        <span style={s.logo}>UniMatch</span>
        <div style={s.userInfo}>
          <button style={s.backBtn} onClick={() => navigate('/dashboard')}>← Dashboard</button>
          <span style={s.userName}>{user?.name}</span>
          <button style={s.logoutBtn} onClick={handleLogout}>Sign Out</button>
        </div>
      </header>

      {toast && (
        <div style={{ ...s.toast, ...(toast.type === 'success' ? s.toastSuccess : s.toastError) }}>
          {toast.msg}
        </div>
      )}

      <div style={s.container}>
        <h1 style={s.title}>Profile Settings</h1>
        <p style={s.subtitle}>Update your subjects and availability to improve your matches.</p>

        {loading ? (
          <p style={{ color: '#64748b' }}>Loading your profile…</p>
        ) : (
          <>
            <div style={s.form}>
              <CheckboxGroup
                label="Your Subjects"
                options={ALL_SUBJECTS}
                selected={subjects}
                onToggle={v => toggle(v, subjects, setSubjects)}
              />
              <CheckboxGroup
                label="Your Availability"
                options={ALL_SLOTS}
                selected={availability}
                onToggle={v => toggle(v, availability, setAvailability)}
              />

              <div style={s.actions}>
                <button style={s.cancelBtn} onClick={() => navigate('/dashboard')}>Cancel</button>
                <button style={s.saveBtn} onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Preferences'}
                </button>
              </div>
            </div>

            {gamificationData && (
              <BadgeDisplay earnedBadges={gamificationData.earnedBadges} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function BadgeDisplay({ earnedBadges }) {
  return (
    <div style={b.section}>
      <h2 style={b.heading}>Achievements</h2>
      <div style={b.grid}>
        {ALL_BADGES.map(badge => {
          const earned = earnedBadges.includes(badge.name);
          return (
            <div key={badge.name} style={{ ...b.card, ...(earned ? b.cardEarned : b.cardLocked) }}>
              <div style={{ ...b.iconWrap, color: earned ? '#3b5bdb' : '#cbd5e1' }}>
                {badge.icon}
                {!earned && (
                  <div style={b.lockOverlay}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                )}
              </div>
              <span style={{ ...b.name, color: earned ? '#1e293b' : '#94a3b8' }}>{badge.name}</span>
              <span style={b.desc}>{badge.desc}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CheckboxGroup({ label, options, selected, onToggle }) {
  return (
    <div style={s.group}>
      <p style={s.groupLabel}>{label}</p>
      <div style={s.checkGrid}>
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
    </div>
  );
}

const s = {
  page:     { minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' },
  topbar:   {
    background: '#3b5bdb', color: '#fff',
    padding: '0 1.5rem', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  logo:     { fontWeight: 700, fontSize: '1.2rem', letterSpacing: '-0.02em' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  userName: { fontSize: '0.9rem' },
  backBtn:  {
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    padding: '0.35rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff',
    padding: '0.35rem 0.8rem', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem',
  },
  toast: {
    position: 'fixed', top: 72, right: 24, zIndex: 1000,
    padding: '0.75rem 1.25rem', borderRadius: 8,
    fontSize: '0.9rem', fontWeight: 500,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  toastSuccess: { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' },
  toastError:   { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
  container: { maxWidth: 680, margin: '2rem auto', padding: '0 1.5rem' },
  title:    { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' },
  subtitle: { margin: '0 0 2rem', color: '#64748b', fontSize: '0.95rem' },
  form:     { background: '#fff', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.07)', marginBottom: '1.5rem' },
  group:    { marginBottom: '1.75rem' },
  groupLabel: {
    margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.85rem',
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  checkGrid:   { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.35rem' },
  checkboxRow: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#334155', padding: '0.25rem 0', cursor: 'pointer' },
  actions:     { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' },
  cancelBtn:   {
    padding: '0.6rem 1.25rem', borderRadius: 8,
    border: '1px solid #e2e8f0', background: '#fff', color: '#64748b',
    fontSize: '0.9rem', cursor: 'pointer',
  },
  saveBtn: {
    padding: '0.6rem 1.5rem', borderRadius: 8,
    border: 'none', background: '#3b5bdb', color: '#fff',
    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
  },
};

const b = {
  section: {
    background: '#fff', borderRadius: 12,
    padding: '1.5rem 1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.07)',
  },
  heading: { margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 700, color: '#1e293b' },
  grid:    {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
    gap: '1rem',
  },
  card: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '1rem 0.75rem', borderRadius: 10,
    gap: '0.4rem', textAlign: 'center',
    border: '1px solid',
  },
  cardEarned: {
    background: '#eff6ff', borderColor: '#bfdbfe',
  },
  cardLocked: {
    background: '#f8fafc', borderColor: '#e2e8f0',
  },
  iconWrap: { position: 'relative', lineHeight: 0 },
  lockOverlay: {
    position: 'absolute', bottom: -4, right: -6,
    background: '#fff', borderRadius: '50%', padding: 1,
    lineHeight: 0,
  },
  name: { fontSize: '0.78rem', fontWeight: 700, lineHeight: 1.2 },
  desc: { fontSize: '0.7rem', color: '#94a3b8', lineHeight: 1.3 },
};
