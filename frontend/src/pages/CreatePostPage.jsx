import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import theme from '../theme';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setThumbnailFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setThumbnailPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    if (!title.trim()) { setError('Title is required.'); return; }
    if (!plainText) { setError('Content cannot be empty.'); return; }

    setLoading(true);
    try {
      // 1. Create the post
      const res = await api.post('/post', { title, content });
      const newPostId = res.data.postId;

      // 2. Upload thumbnail if provided
      if (thumbnailFile && newPostId) {
        const formData = new FormData();
        formData.append('thumbnail', thumbnailFile);
        await api.put(`/post/${newPostId}/thumbnail`, formData);
      }

      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map(e => e.msg).join(' · '));
      } else {
        setError(data?.message || 'Failed to create post.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.header}>
          <h1 style={s.title}>✏️ Write a New Post</h1>
          <p style={s.subtitle}>Share your knowledge with the world</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div style={s.errorBox}>{error}</div>}

          {/* Title */}
          <div style={s.card}>
            <label style={s.label}>Post Title <span style={s.required}>*</span></label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={s.titleInput}
              placeholder="Give your post a catchy title…"
              required
            />
          </div>

          {/* Thumbnail upload - improved UX (bug fix) */}
          <div style={s.card}>
            <label style={s.label}>Thumbnail Image</label>
            {thumbnailPreview ? (
              <div style={s.previewWrap}>
                <img src={thumbnailPreview} alt="Preview" style={s.preview} />
                <div style={s.previewOverlay}>
                  <button type="button" onClick={handleRemoveThumbnail} style={s.removeBtn}>
                    🗑️ Remove
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={s.changeBtn}>
                    🔄 Change
                  </button>
                </div>
              </div>
            ) : (
              <div style={s.uploadZone} onClick={() => fileInputRef.current?.click()}>
                <span style={s.uploadIcon}>🖼️</span>
                <p style={s.uploadText}>Click to upload thumbnail</p>
                <p style={s.uploadHint}>PNG, JPG up to 5MB</p>
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

          {/* Rich text content (bug fix) */}
          <div style={s.card}>
            <label style={s.label}>Content <span style={s.required}>*</span></label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Start writing your amazing post…"
            />
          </div>

          {/* Actions */}
          <div style={s.actions}>
            <button type="button" onClick={() => navigate(-1)} style={s.cancelBtn}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={s.publishBtn}>
              {loading ? 'Publishing…' : '🚀 Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const s = {
  page: { background: theme.bg, minHeight: 'calc(100vh - 65px)', padding: '32px 0 60px' },
  container: { maxWidth: '780px', margin: '0 auto', padding: '0 24px' },
  header: { marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: '800', color: theme.text, marginBottom: '6px' },
  subtitle: { color: theme.textMuted, fontSize: '15px', fontWeight: '600' },
  card: {
    background: '#fff', borderRadius: theme.radius, padding: '24px',
    border: `1px solid ${theme.border}`, boxShadow: theme.shadowCard, marginBottom: '20px',
  },
  label: { display: 'block', fontSize: '14px', fontWeight: '700', color: theme.text, marginBottom: '12px' },
  required: { color: theme.danger },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '12px 20px', borderRadius: theme.radiusSm,
    fontWeight: '600', fontSize: '14px', marginBottom: '16px',
  },
  titleInput: {
    width: '100%', padding: '12px 16px',
    border: `2px solid ${theme.border}`, borderRadius: theme.radiusSm,
    fontSize: '18px', fontWeight: '700', fontFamily: 'Nunito, sans-serif',
    color: theme.text, outline: 'none', boxSizing: 'border-box', background: '#faf8ff',
  },
  uploadZone: {
    border: `2px dashed ${theme.border}`, borderRadius: theme.radiusSm,
    padding: '40px 24px', textAlign: 'center', cursor: 'pointer',
    transition: 'all 0.2s', background: '#faf8ff',
  },
  uploadIcon: { fontSize: '36px', display: 'block', marginBottom: '8px' },
  uploadText: { fontWeight: '700', color: theme.text, fontSize: '14px', marginBottom: '4px' },
  uploadHint: { color: theme.textMuted, fontSize: '12px', fontWeight: '600' },
  previewWrap: { position: 'relative', borderRadius: theme.radiusSm, overflow: 'hidden' },
  preview: { width: '100%', maxHeight: '280px', objectFit: 'cover', display: 'block', borderRadius: theme.radiusSm },
  previewOverlay: {
    position: 'absolute', bottom: '12px', right: '12px',
    display: 'flex', gap: '8px',
  },
  removeBtn: {
    background: theme.dangerLight, color: theme.danger, border: 'none',
    padding: '6px 14px', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '12px', fontFamily: 'Nunito, sans-serif',
  },
  changeBtn: {
    background: theme.primaryLight, color: theme.primaryDark, border: 'none',
    padding: '6px 14px', borderRadius: theme.radiusPill, cursor: 'pointer',
    fontWeight: '700', fontSize: '12px', fontFamily: 'Nunito, sans-serif',
  },
  actions: { display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' },
  cancelBtn: {
    padding: '12px 24px', background: theme.border, color: theme.textMuted,
    border: 'none', borderRadius: theme.radiusSm, fontWeight: '700',
    fontSize: '15px', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
  },
  publishBtn: {
    padding: '12px 28px',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accent})`,
    color: '#fff', border: 'none', borderRadius: theme.radiusSm,
    fontWeight: '800', fontSize: '15px', cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 4px 16px rgba(167,139,250,0.35)',
  },
};
