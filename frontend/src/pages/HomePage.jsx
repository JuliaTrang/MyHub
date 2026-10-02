import { useState, useEffect } from 'react';
import api from '../services/api';
import PostCard from '../components/PostCard';

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/post');
        setPosts(res.data.allPosts || []);
      } catch (err) {
        // 400 means "no post yet" from backend
        if (err.response?.status === 400) {
          setPosts([]);
        } else {
          setError('Failed to load posts');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return <div style={styles.center}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📚 All Posts</h1>
      {error && <p style={styles.error}>{error}</p>}
      {posts.length === 0 ? (
        <p style={styles.empty}>No posts yet. Be the first to create one!</p>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  title: {
    fontSize: '24px',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  center: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '12px',
  },
  empty: {
    textAlign: 'center',
    color: '#999',
    fontSize: '16px',
    marginTop: '40px',
  },
  grid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};
