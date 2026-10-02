import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>📚 Knowledge Hub</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <Link to="/create-post" style={styles.link}>+ New Post</Link>
            <span style={styles.username}>Hi, {user.username}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#fff',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  link: {
    color: '#ecf0f1',
    textDecoration: 'none',
    fontSize: '14px',
  },
  username: {
    color: '#f39c12',
    fontSize: '14px',
    fontWeight: '600',
  },
  logoutBtn: {
    background: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '6px 14px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
};
