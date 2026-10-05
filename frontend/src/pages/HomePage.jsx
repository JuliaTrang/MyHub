import { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import theme from '../theme';

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/post');
        setPosts(res.data.allPosts || []);
      } catch (err) {
        if (err.response?.status === 400) {
          setPosts([]);
        } else {
          setError('Failed to load posts. Is the server running?');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div style={s.loadingWrap}>
      <div style={s.loadingSpinner}>🌸</div>
      <p style={s.loadingText}>Loading posts…</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Hero banner */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>Knowledge Hub</h1>
        <p style={s.heroSub}>Discover stories, ideas & knowledge shared by our community</p>
        {user && (
          <Link to="/create-post" style={s.heroBtn}>✏️ Write your story</Link>
        )}
      </div>

      <div style={s.container}>
        {error && <div style={s.errorBox}>{error}</div>}

        {posts.length === 0 ? (
          <div style={s.empty}>
            <span style={s.emptyIcon}>🌷</span>
            <h3 style={s.emptyTitle}>No posts yet!</h3>
            <p style={s.emptyText}>Be the first to share your knowledge.</p>
            {user && <Link to="/create-post" style={s.emptyBtn}>Create First Post</Link>}
          </div>
        ) : (
          <>
            <h2 style={s.sectionTitle}>Recent Posts</h2>
            <div style={s.grid}>
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: '100%' },
  hero: {
    background: `linear-gradient(135deg, ${theme.primaryLight} 0%, ${theme.accentLight} 100%)`,
    borderBottom: `1px solid ${theme.border}`,
    padding: '48px 32px',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: '36px', fontWeight: '800', color: theme.text, marginBottom: '10px',
  },
  heroSub: { color: theme.textMuted, fontSize: '16px', fontWeight: '600', marginBottom: '20px' },
  heroBtn: {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', padding: '12px 28px', borderRadius: theme.radiusPill,
    fontWeight: '800', fontSize: '15px', textDecoration: 'none',
    boxShadow: '0 4px 16px rgba(167,139,250,0.35)',
  },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '12px',
  },
  loadingSpinner: { fontSize: '48px', animation: 'spin 2s linear infinite' },
  loadingText: { color: theme.textMuted, fontWeight: '600', fontSize: '15px' },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '20px', fontWeight: '800', color: theme.text, marginBottom: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  empty: {
    textAlign: 'center', padding: '60px 24px',
    background: '#fff', borderRadius: theme.radiusLg,
    border: `1px solid ${theme.border}`,
  },
  emptyIcon: { fontSize: '56px', display: 'block', marginBottom: '16px' },
  emptyTitle: { fontSize: '22px', fontWeight: '800', color: theme.text, marginBottom: '8px' },
  emptyText: { color: theme.textMuted, fontSize: '15px', marginBottom: '20px', fontWeight: '600' },
  emptyBtn: {
    display: 'inline-block',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', padding: '12px 24px', borderRadius: theme.radiusPill,
    fontWeight: '800', fontSize: '14px', textDecoration: 'none',
  },
};
