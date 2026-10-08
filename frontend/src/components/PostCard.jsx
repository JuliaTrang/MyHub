import { useState } from 'react';
import { Link } from 'react-router-dom';
import theme from '../theme';

const COLORS = [
  '#f0eef5',
  '#f5eef0',
  '#eef5f0',
  '#f5f4ee',
];

export default function PostCard({ post, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl = post.thumbnail
    ? `https://zonal-growth-production-561c.up.railway.app/${post.thumbnail}`
    : null;

  const bgColor = COLORS[index % COLORS.length];
  const authorAvatarUrl = post.author?.avatar ? `https://zonal-growth-production-561c.up.railway.app/${post.author.avatar}` : null;
  const authorInitial = post.author?.username?.[0]?.toUpperCase() || '?';
  const commentCount = post.comments?.length ?? 0;
  const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  return (
    <Link to={`/post/${post.id}`} style={{ textDecoration: 'none' }}>
      <div 
        style={{ ...s.card, ...(isHovered ? s.cardHover : {}) }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        <div style={{ ...s.thumbnail, ...(thumbnailUrl ? {} : { background: bgColor }) }}>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt={post.title} style={s.thumbnailImg} />
          )}
        </div>

        {/* Body */}
        <div style={s.body}>
          <h3 style={s.title}>{post.title}</h3>

          <p style={s.excerpt}>
            {post.content
              ? (post.content.replace(/<[^>]*>/g, '').slice(0, 120) + (post.content.length > 120 ? '…' : ''))
              : ''}
          </p>

          <div style={s.footer}>
            <div style={s.authorChip}>
              <div style={s.authorAvatar}>
                {authorAvatarUrl ? <img src={authorAvatarUrl} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : authorInitial}
              </div>
              <span style={s.authorName}>{post.author?.username || 'Unknown'}</span>
              {date && <span style={s.date}>· {date}</span>}
            </div>
            <div style={s.commentBadge}>
              <span style={s.commentIcon}>💬</span>
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const s = {
  card: {
    background: theme.bgCard,
    borderRadius: theme.radiusSm,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: `1px solid ${theme.border}`,
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  thumbnail: {
    height: '180px',
    width: '100%',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
    borderBottom: `1px solid ${theme.border}`,
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: '20px 20px 24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: theme.text,
    marginBottom: '10px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  excerpt: {
    fontSize: '14px',
    color: theme.textMuted,
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '20px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: `1px solid ${theme.border}40`,
  },
  authorChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  authorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: theme.primary,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    flexShrink: 0,
  },
  authorName: {
    fontSize: '13px',
    fontWeight: '600',
    color: theme.text,
  },
  date: {
    fontSize: '12px',
    color: theme.textLight,
  },
  commentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: theme.textMuted,
    fontSize: '13px',
    fontWeight: '600',
  },
  commentIcon: {
    fontSize: '12px',
    opacity: 0.7,
  }
};
