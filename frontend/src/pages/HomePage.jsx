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
      <div style={s.loadingSpinner}>🌿</div>
      <p style={s.loadingText}>Loading posts…</p>
    </div>
  );

  return (
    <div style={s.page}>
      {/* Hero banner */}
      <div style={s.hero}>
        <div style={s.heroContent}>
          <h1 style={s.heroTitle}>welcome to my love maze</h1>
          <p style={s.heroSub}>
            LELE / NANA<br />
            <span style={{ fontSize: '13px', opacity: 0.85 }}>loml — @the_and.y <br /> ( 🌷 ) — broken melodies : nct dream</span>
          </p>
          {user && (
            <Link to="/create-post" style={s.heroBtn}>✏️ Write your story</Link>
          )}
        </div>
      </div>

      <div style={s.container}>
        {error && <div style={s.errorBox}>{error}</div>}

        <div style={s.layoutGrid}>
          {/* Main Content (Posts) */}
          <div style={s.mainCol}>
            {posts.length === 0 ? (
              <div style={s.empty}>
                <span style={s.emptyIcon}>🌱</span>
                <h3 style={s.emptyTitle}>No posts yet!</h3>
                <p style={s.emptyText}>Be the first to share your knowledge.</p>
                {user && <Link to="/create-post" style={s.emptyBtn}>Create First Post</Link>}
              </div>
            ) : (
              <>
                <h2 style={s.sectionTitle}>RECENT POSTS</h2>
                <div style={s.postsGrid}>
                  {posts.map((post, i) => (
                    <PostCard key={post.id} post={post} index={i} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div style={s.sidebarCol}>
            {/* Social Media Acc */}
            <div style={s.sidebarBlock}>
              <h2 style={s.sidebarTitle}>SOCIAL MEDIA ACC</h2>
              <div style={s.socialGrid}>
                <div style={s.socialCard}>
                  <div style={{ ...s.socialImg, background: '#4A7C4E' }}></div>
                  <span style={s.socialLabel}>Instagram</span>
                </div>
                <div style={s.socialCard}>
                  <div style={{ ...s.socialImg, background: '#6EBF74' }}></div>
                  <span style={s.socialLabel}>Mercari</span>
                </div>
                <div style={s.socialCard}>
                  <div style={{ ...s.socialImg, background: '#8DA882' }}></div>
                  <span style={s.socialLabel}>Tumblr</span>
                </div>
                <div style={s.socialCard}>
                  <div style={{ ...s.socialImg, background: '#2F5C33' }}></div>
                  <span style={s.socialLabel}>Tiktok</span>
                </div>
              </div>
            </div>

            {/* Recent Searches */}
            <div style={s.sidebarBlock}>
              <h2 style={s.sidebarTitle}>RECENT SEARCHES</h2>
              <div style={s.searchList}>
                <div style={s.searchPill}>🔍 guidelines</div>
                <div style={s.searchPill}>🔍 lovelist</div>
                <div style={s.searchPill}>🔍 sell/trade info</div>
                <div style={s.searchPill}>🔍 ib: R1nzukii</div>
              </div>
            </div>

            {/* Profile Card */}
            <div style={s.sidebarBlock}>
              <h2 style={s.sidebarTitle}>PROFILE INFO</h2>
              <div style={s.profileCard}>
                <div style={s.profileRow}>
                  <div style={s.profileAvatar}>🌿</div>
                  <div>
                    <div style={s.profileName}>LEENA</div>
                    <div style={s.profileMeta}>she/her • nineteen<br/>ISTJ-T • thai</div>
                  </div>
                </div>
              </div>
              <div style={s.profileCard}>
                <div style={s.profileRow}>
                  <div style={s.profileAvatar}>💚</div>
                  <div>
                    <div style={s.profileName}>LIKES</div>
                    <div style={s.profileMeta}>nct dream, boy groups<br/>late night drives, rainy days</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: '100%' },
  hero: {
    background: `linear-gradient(135deg, ${theme.primaryLight} 0%, ${theme.accentLight} 100%)`,
    borderBottom: `1px solid ${theme.border}`,
    padding: '60px 32px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
    height: '320px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContent: {
    position: 'relative',
    zIndex: 2,
    background: 'rgba(255,255,255,0.2)',
    padding: '24px 48px',
    borderRadius: theme.radiusLg,
    backdropFilter: 'blur(4px)',
  },
  heroTitle: {
    fontSize: '36px', fontWeight: '500', color: theme.text, marginBottom: '16px',
    fontFamily: '"Nunito", sans-serif', textTransform: 'lowercase',
  },
  heroSub: { color: theme.textMuted, fontSize: '15px', fontWeight: '400', marginBottom: '24px', lineHeight: 1.6 },
  heroBtn: {
    display: 'inline-block',
    background: theme.primary,
    color: '#fff', padding: '10px 24px', borderRadius: theme.radiusPill,
    fontWeight: '700', fontSize: '14px', textDecoration: 'none',
    boxShadow: theme.shadow,
    transition: 'all 0.2s',
  },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '32px',
    alignItems: 'start',
  },
  mainCol: { flex: 1 },
  sidebarCol: { width: '100%', display: 'flex', flexDirection: 'column', gap: '32px' },
  loadingWrap: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '12px',
  },
  loadingSpinner: { fontSize: '48px', animation: 'pulse 1.5s infinite' },
  loadingText: { color: theme.textMuted, fontWeight: '600', fontSize: '15px' },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '16px', fontWeight: '800', color: theme.text, marginBottom: '20px', textTransform: 'uppercase',
  },
  sidebarTitle: {
    fontSize: '14px', fontWeight: '800', color: theme.text, marginBottom: '16px', textTransform: 'uppercase',
  },
  postsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  empty: {
    textAlign: 'center', padding: '60px 24px',
    background: theme.bgCard, borderRadius: theme.radiusLg,
    border: `1px solid ${theme.border}`,
  },
  emptyIcon: { fontSize: '56px', display: 'block', marginBottom: '16px' },
  emptyTitle: { fontSize: '22px', fontWeight: '800', color: theme.text, marginBottom: '8px' },
  emptyText: { color: theme.textMuted, fontSize: '15px', marginBottom: '20px', fontWeight: '600' },
  emptyBtn: {
    display: 'inline-block',
    background: theme.primary,
    color: '#fff', padding: '12px 24px', borderRadius: theme.radiusPill,
    fontWeight: '800', fontSize: '14px', textDecoration: 'none',
  },

  // Sidebar widgets
  sidebarBlock: {
    marginBottom: '8px',
  },
  socialGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  socialCard: {
    position: 'relative',
    borderRadius: theme.radiusSm,
    overflow: 'hidden',
    height: '100px',
    cursor: 'pointer',
  },
  socialImg: {
    width: '100%',
    height: '100%',
  },
  socialLabel: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '600',
    padding: '24px 8px 8px',
    textAlign: 'center',
  },
  searchList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  searchPill: {
    background: theme.accent,
    color: '#fff',
    fontWeight: '600',
    fontSize: '14px',
    padding: '8px 16px',
    borderRadius: theme.radiusPill,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  profileCard: {
    background: theme.bgCard,
    padding: '16px',
    borderRadius: theme.radius,
    border: `1px solid ${theme.border}`,
    marginBottom: '12px',
  },
  profileRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  profileAvatar: {
    fontSize: '32px',
    background: theme.primaryLight,
    borderRadius: '50%',
    width: '48px', height: '48px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  profileName: {
    fontSize: '14px',
    fontWeight: '800',
    color: theme.primaryDark,
    marginBottom: '2px',
  },
  profileMeta: {
    fontSize: '12px',
    color: theme.textMuted,
    lineHeight: 1.4,
  },
};
