import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import RichTextEditor from '../components/RichTextEditor';
import theme from '../theme';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbSuccess, setThumbSuccess] = useState('');

  const fetchPost = async () => {
    try {
      // Use GET /post and filter — backend's GET /post/:id returns posts by userId, not post id
      const res = await api.get('/post');
      const allPosts = res.data.allPosts || [];
      const found = allPosts.find((p) => p.id === parseInt(id));
      if (found) {
        setPost(found);
        setEditForm({ title: found.title, content: found.content || '' });
      } else {
        setError('Post not found');
      }
    } catch {
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPost(); }, [id]);

  const isOwner = user && post && post.author && user.username === post.author.username;

  const handleUpdate = async (e) => {
    e.preventDefault();
    const plain = editForm.content.replace(/<[^>]*>/g, '').trim();
    if (!plain) { setError('Content cannot be empty.'); return; }
    try {
      await api.put(`/post/${post.id}`, editForm);
      setPost({ ...post, ...editForm });
      setEditing(false);
      setError('');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map(e => e.msg).join(' · '));
      } else {
        setError(data?.message || 'Failed to update post');
      }
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    try {
      await api.delete(`/post/${post.id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
    }
  };

  // Improved thumbnail upload UX (bug fix)
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleThumbnailUpload = async () => {
    if (!thumbnailFile) return;
    setThumbUploading(true);
    setThumbSuccess('');
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    try {
      await api.put(`/post/${post.id}/thumbnail`, formData);
      setThumbSuccess('Thumbnail updated! ✨');
      setThumbnailFile(null);
      setThumbnailPreview(null);
      await fetchPost(); // refresh post data
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload thumbnail');
    } finally {
      setThumbUploading(false);
    }
  };

  if (loading) return (
    <div style={s.center}>
      <span style={s.loadingIcon}>🌸</span>
      <p style={s.loadingText}>Loading…</p>
    </div>
  );
  if (error && !post) return (
    <div style={s.center}>
      <p style={{ color: theme.danger, fontWeight: '700' }}>{error}</p>
      <Link to="/" style={s.backLink}>← Go home</Link>
    </div>
  );
  if (!post) return null;

  const thumbnailUrl = post.thumbnail ? `http://localhost:3001/${post.thumbnail}` : null;
  const date = post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div style={s.page}>
      <div style={s.container}>
        {/* Back link */}
        <Link to="/" style={s.backLink}>← Back to Home</Link>

        {error && <div style={s.errorBox}>{error}</div>}

        {editing ? (
          /* ── EDIT MODE ── */
          <div style={s.editCard}>
            <h2 style={s.editTitle}>✏️ Edit Post</h2>
            <form onSubmit={handleUpdate}>
              <div style={s.field}>
                <label style={s.label}>Title</label>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  style={s.titleInput}
                  required
                />
              </div>
              <div style={s.field}>
                <label style={s.label}>Content</label>
                <RichTextEditor
                  value={editForm.content}
                  onChange={(val) => setEditForm({ ...editForm, content: val })}
                />
              </div>
              <div style={s.editActions}>
                <button type="submit" style={s.saveBtn}>💾 Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} style={s.cancelBtn}>Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          /* ── VIEW MODE ── */
          <article style={s.article}>
            {/* Thumbnail */}
            {thumbnailUrl && (
              <div style={s.thumbnailWrap}>
                <img src={thumbnailUrl} alt={post.title} style={s.thumbnail} />
              </div>
            )}

            {/* Header */}
            <div style={s.articleHeader}>
              <h1 style={s.postTitle}>{post.title}</h1>
              <div style={s.meta}>
                <div style={s.authorChip}>
                  <div style={s.authorAvatar}>
                    {post.author?.avatar ? <img src={`http://localhost:3001/${post.author.avatar}`} alt="" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : (post.author?.username?.[0]?.toUpperCase() || '?')}
                  </div>
                  <span style={s.authorName}>{post.author?.username || 'Unknown'}</span>
                </div>
                {date && <span style={s.date}>📅 {date}</span>}
              </div>
            </div>

            {/* Content rendered as HTML from rich text editor */}
            <div
              style={s.content}
              dangerouslySetInnerHTML={{ __html: post.content || '' }}
            />

            {/* Owner actions */}
            {isOwner && (
              <div style={s.ownerPanel}>
                <h4 style={s.ownerPanelTitle}>⚙️ Post Management</h4>
                <div style={s.ownerActions}>
                  <button onClick={() => setEditing(true)} style={s.editBtn}>✏️ Edit Post</button>
                  <button onClick={handleDelete} style={s.deleteBtn}>🗑️ Delete Post</button>
                </div>

                {/* Improved thumbnail upload (bug fix) */}
                <div style={s.thumbSection}>
                  <p style={s.thumbLabel}>Update Thumbnail</p>
                  {thumbnailPreview ? (
                    <div style={s.thumbPreviewWrap}>
                      <img src={thumbnailPreview} alt="New thumbnail" style={s.thumbPreview} />
                      <div style={s.thumbPreviewActions}>
                        <button onClick={handleThumbnailUpload} disabled={thumbUploading} style={s.uploadBtn}>
                          {thumbUploading ? 'Uploading…' : '⬆️ Upload'}
                        </button>
                        <button onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }} style={s.removeThumbBtn}>
                          ✕ Remove
                        </button>
                      </div>
                      {thumbSuccess && <p style={s.thumbSuccess}>{thumbSuccess}</p>}
                    </div>
                  ) : (
                    <div style={s.thumbZone} onClick={() => fileInputRef.current?.click()}>
                      <span>🖼️ Click to select new thumbnail</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            )}

            <CommentSection postId={post.id} comments={post.comments || []} />
          </article>
        )}
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: 'calc(100vh - 65px)', padding: '32px 0 60px' },
  container: { maxWidth: '780px', margin: '0 auto', padding: '0 24px' },
  center: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: '12px',
  },
  loadingIcon: { fontSize: '48px' },
  loadingText: { color: theme.textMuted, fontWeight: '600', fontSize: '15px' },
  backLink: {
    display: 'inline-flex', alignItems: 'center', gap: '4px',
    color: theme.textMuted, fontWeight: '700', fontSize: '14px',
    marginBottom: '20px', textDecoration: 'none',
  },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '16px',
  },
  article: {
    background: '#fff', borderRadius: theme.radiusLg,
    border: `1px solid ${theme.border}`, boxShadow: theme.shadowCard, overflow: 'hidden',
  },
  thumbnailWrap: { width: '100%', maxHeight: '380px', overflow: 'hidden' },
  thumbnail: { width: '100%', height: '380px', objectFit: 'cover' },
  articleHeader: { padding: '28px 32px 20px' },
  postTitle: { fontSize: '30px', fontWeight: '800', color: theme.text, marginBottom: '14px', lineHeight: '1.3' },
  meta: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  authorChip: { display: 'flex', alignItems: 'center', gap: '8px' },
  authorAvatar: {
    width: '32px', height: '32px', borderRadius: '50%',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: '800', fontSize: '13px',
  },
  authorName: { fontWeight: '700', fontSize: '14px', color: theme.text },
  date: { color: theme.textMuted, fontSize: '13px', fontWeight: '600' },
  content: {
    padding: '0 32px 28px',
    fontSize: '16px', lineHeight: '1.8', color: theme.text,
    // Quill content styles
  },
  ownerPanel: {
    margin: '0 32px 28px',
    background: theme.bgCardHover,
    borderRadius: theme.radiusSm,
    padding: '20px',
    border: `1px solid ${theme.border}`,
  },
  ownerPanelTitle: { fontSize: '14px', fontWeight: '800', color: theme.text, marginBottom: '14px' },
  ownerActions: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' },
  editBtn: {
    padding: '9px 20px', background: theme.primaryLight, color: theme.primaryDark,
    border: 'none', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif',
  },
  deleteBtn: {
    padding: '9px 20px', background: theme.dangerLight, color: theme.danger,
    border: 'none', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '13px', fontFamily: 'Nunito, sans-serif',
  },
  thumbSection: { borderTop: `1px solid ${theme.border}`, paddingTop: '16px' },
  thumbLabel: { fontSize: '13px', fontWeight: '700', color: theme.text, marginBottom: '10px' },
  thumbZone: {
    border: `2px dashed ${theme.border}`, borderRadius: theme.radiusSm,
    padding: '16px', textAlign: 'center', cursor: 'pointer',
    color: theme.textMuted, fontSize: '13px', fontWeight: '600',
  },
  thumbPreviewWrap: { position: 'relative' },
  thumbPreview: { width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: theme.radiusSm, display: 'block' },
  thumbPreviewActions: { display: 'flex', gap: '8px', marginTop: '10px' },
  uploadBtn: {
    padding: '7px 16px', background: theme.primary, color: '#fff',
    border: 'none', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '12px', fontFamily: 'Nunito, sans-serif',
  },
  removeThumbBtn: {
    padding: '7px 14px', background: theme.dangerLight, color: theme.danger,
    border: 'none', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '12px', fontFamily: 'Nunito, sans-serif',
  },
  thumbSuccess: { color: '#065f46', fontWeight: '700', fontSize: '12px', marginTop: '8px' },
  // Edit mode
  editCard: {
    background: '#fff', borderRadius: theme.radiusLg,
    border: `1px solid ${theme.border}`, boxShadow: theme.shadowCard, padding: '32px',
  },
  editTitle: { fontSize: '22px', fontWeight: '800', color: theme.text, marginBottom: '24px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '700', color: theme.text, marginBottom: '8px' },
  titleInput: {
    width: '100%', padding: '12px 16px',
    border: `2px solid ${theme.border}`, borderRadius: theme.radiusSm,
    fontSize: '17px', fontWeight: '700', fontFamily: 'Nunito, sans-serif',
    color: theme.text, outline: 'none', boxSizing: 'border-box', background: '#faf8ff',
  },
  editActions: { display: 'flex', gap: '12px', marginTop: '24px' },
  saveBtn: {
    padding: '12px 28px', background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', border: 'none', borderRadius: theme.radiusSm,
    fontWeight: '800', fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 4px 12px rgba(167,139,250,0.35)',
  },
  cancelBtn: {
    padding: '12px 24px', background: theme.border, color: theme.textMuted,
    border: 'none', borderRadius: theme.radiusSm,
    fontWeight: '700', fontSize: '14px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
};
