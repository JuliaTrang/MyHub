import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  const thumbnailUrl = post.thumbnail
    ? `http://localhost:3001/${post.thumbnail}`
    : null;

  return (
    <div style={styles.card}>
      {thumbnailUrl && (
        <img src={thumbnailUrl} alt={post.title} style={styles.thumbnail} />
      )}
      <div style={styles.body}>
        <h3 style={styles.title}>
          <Link to={`/post/${post.id}`} style={styles.titleLink}>{post.title}</Link>
        </h3>
        <p style={styles.content}>
          {post.content && post.content.length > 150
            ? post.content.substring(0, 150) + '...'
            : post.content}
        </p>
        <div style={styles.footer}>
          <span style={styles.author}>
            ✍️ {post.author ? post.author.username : 'Unknown'}
          </span>
          <span style={styles.comments}>
            💬 {post.comments ? post.comments.length : 0} comments
          </span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: '16px',
  },
  thumbnail: {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
  },
  body: {
    padding: '16px',
  },
  title: {
    margin: '0 0 8px 0',
    fontSize: '18px',
  },
  titleLink: {
    color: '#2c3e50',
    textDecoration: 'none',
  },
  content: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5',
    margin: '0 0 12px 0',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    color: '#888',
  },
  author: {},
  comments: {},
};
