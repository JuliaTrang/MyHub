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

  const linkStyle = (path) => ({
    ...s.link,
    ...(isActive(path) ? s.linkActive : {}),
  });

  return (
    <nav style={s.nav}>
      <Link to="/" style={s.brand}>
        <span style={s.brandText}>Knowledge Hub</span>
      </Link>

      <div style={s.links}>
        {user ? (
          <>
            <Link to="/" style={linkStyle('/')}>Home</Link>
            <Link to="/profile" style={linkStyle('/profile')}>My Profile</Link>
            <Link to="/create-post" style={s.writeBtn}>
              ✏️ Write Post
            </Link>
            <div style={s.userChip}>
              <div style={s.avatar}>
                {user.avatar
                  ? <img src={`https://zonal-growth-production-561c.up.railway.app/${user.avatar}`} alt="" style={s.avatarImg} />
                  : <span>{user.username?.[0]?.toUpperCase()}</span>
                }
              </div>
              <span style={s.username}>{user.username}</span>
            </div>
            <button onClick={handleLogout} style={s.logoutBtn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle('/login')}>Login</Link>
            <Link to="/register" style={s.writeBtn}>Register</Link>
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
    padding: '14px 32px',
    background: 'rgba(255,255,255,0.85)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${theme.border}`,
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px rgba(167,139,250,0.08)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    textDecoration: 'none',
  },
  brandIcon: {
    fontSize: '26px',
    background: theme.primaryLight,
    borderRadius: theme.radiusSm,
    padding: '4px 8px',
  },
  brandText: {
    fontSize: '20px',
    fontWeight: '800',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accentDark})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  link: {
    color: theme.textMuted,
    fontWeight: '600',
    fontSize: '14px',
    padding: '6px 14px',
    borderRadius: theme.radiusPill,
    transition: 'all 0.2s',
    textDecoration: 'none',
  },
  linkActive: {
    background: theme.primaryLight,
    color: theme.primaryDark,
  },
  writeBtn: {
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff',
    fontWeight: '700',
    fontSize: '14px',
    padding: '8px 18px',
    borderRadius: theme.radiusPill,
    textDecoration: 'none',
    boxShadow: '0 4px 12px rgba(167,139,250,0.35)',
    transition: 'all 0.2s',
    border: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
  },
  userChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: theme.primaryLight,
    borderRadius: theme.radiusPill,
    padding: '4px 14px 4px 4px',
    marginLeft: '4px',
  },
  avatar: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '12px',
    overflow: 'hidden',
    flexShrink: 0,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  username: {
    color: theme.primaryDark,
    fontWeight: '700',
    fontSize: '13px',
  },
  logoutBtn: {
    background: theme.dangerLight,
    color: theme.danger,
    border: 'none',
    padding: '7px 16px',
    borderRadius: theme.radiusPill,
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};
