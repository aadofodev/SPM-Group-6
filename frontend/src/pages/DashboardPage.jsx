import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome, {user?.name}!</h1>
        <p style={styles.subtitle}>You are now logged in to UniMatch.</p>
        <button style={styles.button} onClick={handleLogout}>Sign Out</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f0f4ff',
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '2.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  title: { color: '#3b5bdb' },
  subtitle: { color: '#666' },
  button: {
    padding: '0.75rem 1.5rem',
    borderRadius: 8,
    border: 'none',
    background: '#e03131',
    color: '#fff',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
};
