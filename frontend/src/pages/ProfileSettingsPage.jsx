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

const API = 'http://localhost:5001';

export default function ProfileSettingsPage() {
  const { token, user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [subjects,      setSubjects]     = useState([]);
  const [availability,  setAvailability] = useState([]);
  const [loading,       setLoading]      = useState(true);
  const [saving,        setSaving]       = useState(false);
  const [toast,         setToast]        = useState(null); // { type: 'success'|'error', msg }

  // Load current profile on mount
  useEffect(() => {
    axios.get(`${API}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(({ data }) => {
        setSubjects(data.subjects || []);
        setAvailability(data.availability || []);
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
      // Brief delay so user sees the toast, then return to dashboard
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
        )}
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
    transition: 'opacity 0.3s',
  },
  toastSuccess: { background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0' },
  toastError:   { background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca' },
  container: {
    maxWidth: 680, margin: '2rem auto', padding: '0 1.5rem',
  },
  title:    { margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 700, color: '#1e293b' },
  subtitle: { margin: '0 0 2rem', color: '#64748b', fontSize: '0.95rem' },
  form:     { background: '#fff', borderRadius: 12, padding: '1.75rem', boxShadow: '0 1px 8px rgba(0,0,0,0.07)' },
  group:    { marginBottom: '1.75rem' },
  groupLabel: {
    margin: '0 0 0.75rem', fontWeight: 600, fontSize: '0.85rem',
    color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em',
  },
  checkGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '0.35rem' },
  checkboxRow: { display: 'flex', alignItems: 'center', fontSize: '0.9rem', color: '#334155', padding: '0.25rem 0', cursor: 'pointer' },
  actions:  { display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' },
  cancelBtn: {
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
