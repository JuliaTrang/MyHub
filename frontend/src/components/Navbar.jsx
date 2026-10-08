import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={s.nav}>
      {/* Left — Logo */}
      <Link to="/" style={s.brand} id="nav-brand">
        <span style={s.brandLeaf}>🌿</span>
        <span style={s.brandText}>MyHub</span>
      </Link>

      {/* Center — Nav links */}
      <div style={s.centerLinks}>
        <Link to="/" style={isActive('/') ? { ...s.link, ...s.linkActive } : s.link} id="nav-home">
          Home
        </Link>
        <Link to="/students" style={isActive('/students') ? { ...s.link, ...s.linkActive } : s.link} id="nav-students">
          Students
        </Link>
        {user && (
          <Link to="/profile" style={isActive('/profile') ? { ...s.link, ...s.linkActive } : s.link} id="nav-profile">
            My Profile
          </Link>
        )}
      </div>

      {/* Right — Auth */}
      <div style={s.rightGroup}>
        {user ? (
          <>
            {/* Avatar chip */}
            <div style={s.userChip} id="nav-user-chip">
              <div style={s.avatar}>
                {user.avatar
                  ? <img src={`https://zonal-growth-production-561c.up.railway.app/${user.avatar}`} alt="" style={s.avatarImg} />
                  : <span style={s.avatarInitial}>{user.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <span style={s.username}>{user.username}</span>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn} id="nav-logout">
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={s.loginBtn} id="nav-login">Log In</Link>
            <Link to="/register" style={s.registerBtn} id="nav-register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

const s = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 32px',
    height: '56px',
    background: 'rgba(245,243,238,0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${theme.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: `0 1px 8px rgba(74,124,78,0.07)`,
  },

  // Brand
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  brandLeaf: { fontSize: '20px' },
  brandText: {
    fontSize: '18px',
    fontWeight: '800',
    color: theme.primary,
    letterSpacing: '-0.3px',
  },

  // Center nav
  centerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
  },
  link: {
    color: theme.textMuted,
    fontWeight: '600',
    fontSize: '14px',
    padding: '6px 14px',
    borderRadius: theme.radiusPill,
    textDecoration: 'none',
  },
  linkActive: {
    background: theme.primaryLight,
    color: theme.primaryDark,
    fontWeight: '700',
  },

  // Right group
  rightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  },
  loginBtn: {
    padding: '6px 18px',
    border: `1.5px solid ${theme.primary}`,
    borderRadius: theme.radiusPill,
    color: theme.primary,
    fontWeight: '700',
    fontSize: '13px',
    textDecoration: 'none',
    background: 'transparent',
  },
  registerBtn: {
    padding: '7px 18px',
    background: theme.primary,
    borderRadius: theme.radiusPill,
    color: '#fff',
    fontWeight: '700',
    fontSize: '13px',
    textDecoration: 'none',
    boxShadow: `0 2px 8px rgba(74,124,78,0.28)`,
  },

  // User chip
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: theme.primaryLight,
    borderRadius: theme.radiusPill,
    padding: '4px 14px 4px 4px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: theme.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
  avatarInitial: { color: '#fff', fontWeight: '800', fontSize: '13px' },
  username: { color: theme.primaryDark, fontWeight: '700', fontSize: '13px' },

  logoutBtn: {
    background: theme.dangerLight,
    color: theme.danger,
    border: 'none',
    padding: '6px 14px',
    borderRadius: theme.radiusPill,
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
  },
};
