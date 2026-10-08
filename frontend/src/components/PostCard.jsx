import { useState } from 'react';
import { Link } from 'react-router-dom';
import theme from '../theme';

const GRADIENTS = [
  'linear-gradient(135deg, #D6E8D7, #8DA882)',
  'linear-gradient(135deg, #E8EDE3, #A8B99A)',
  'linear-gradient(135deg, #D4EED6, #6EBF74)',
  'linear-gradient(135deg, #F5F3EE, #C5D1BC)',
];

export default function PostCard({ post, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  const thumbnailUrl = post.thumbnail
    ? `https://zonal-growth-production-561c.up.railway.app/${post.thumbnail}`
    : null;

  const gradient = GRADIENTS[index % GRADIENTS.length];
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
        <div style={{ ...s.thumbnail, ...(thumbnailUrl ? {} : { background: gradient }) }}>
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
              <span>💬</span>
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
    borderRadius: theme.radius,
    overflow: 'hidden',
    boxShadow: theme.shadowCard,
    border: `1px solid ${theme.border}`,
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHover: {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadowHover,
  },
  thumbnail: {
    height: '160px',
    width: '100%',
    flexShrink: 0,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  body: {
    padding: '18px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    fontSize: '16px',
    fontWeight: '800',
    color: theme.text,
    marginBottom: '8px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  excerpt: {
    fontSize: '13px',
    color: theme.textMuted,
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '14px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  authorAvatar: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accentDark})`,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '700',
    flexShrink: 0,
  },
  authorName: {
    fontSize: '12px',
    fontWeight: '700',
    color: theme.text,
  },
  date: {
    fontSize: '11px',
    color: theme.textMuted,
  },
  commentBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: theme.primaryLight,
    color: theme.primaryDark,
    fontSize: '12px',
    fontWeight: '700',
    padding: '3px 10px',
    borderRadius: theme.radiusPill,
  },
};
