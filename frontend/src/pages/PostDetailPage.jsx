import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';

export default function PostDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', content: '' });
  const [thumbnailFile, setThumbnailFile] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get('/post');
        const allPosts = res.data.allPosts || [];
        const found = allPosts.find((p) => p.id === parseInt(id));
        if (found) {
          setPost(found);
          setEditForm({ title: found.title, content: found.content });
        } else {
          setError('Post not found');
        }
      } catch {
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const isOwner = user && post && post.author && user.username === post.author.username;

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/post/${post.id}`, editForm);
      setPost({ ...post, ...editForm });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/post/${post.id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post');
    }
  };

  const handleThumbnailUpload = async (e) => {
    e.preventDefault();
    if (!thumbnailFile) return;
    const formData = new FormData();
    formData.append('thumbnail', thumbnailFile);
    try {
      await api.put(`/post/${post.id}/thumbnail`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Refresh to show new thumbnail
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload thumbnail');
    }
  };

  if (loading) return <div style={styles.center}>Loading...</div>;
  if (error && !post) return <div style={styles.center}>{error}</div>;
  if (!post) return <div style={styles.center}>Post not found</div>;

  const thumbnailUrl = post.thumbnail
    ? `http://localhost:3001/${post.thumbnail}`
    : null;

  return (
    <div style={styles.container}>
      {error && <p style={styles.error}>{error}</p>}

      {editing ? (
        <form onSubmit={handleUpdate} style={styles.editForm}>
          <h2 style={styles.editTitle}>Edit Post</h2>
          <div style={styles.field}>
            <label style={styles.label}>Title</label>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Content</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
              style={styles.textarea}
              rows={8}
              required
            />
          </div>
          <div style={styles.editActions}>
            <button type="submit" style={styles.saveBtn}>Save</button>
            <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          {thumbnailUrl && (
            <img src={thumbnailUrl} alt={post.title} style={styles.thumbnail} />
          )}
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <span>✍️ {post.author ? post.author.username : 'Unknown'}</span>
            <span> · {new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={styles.content}>{post.content}</p>

          {isOwner && (
            <div style={styles.ownerActions}>
              <button onClick={() => setEditing(true)} style={styles.editBtn}>✏️ Edit</button>
              <button onClick={handleDelete} style={styles.deleteBtn}>🗑️ Delete</button>
              <form onSubmit={handleThumbnailUpload} style={styles.uploadForm}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files[0])}
                  style={styles.fileInput}
                />
                <button type="submit" style={styles.uploadBtn}>Upload Thumbnail</button>
              </form>
            </div>
          )}

          <CommentSection postId={post.id} comments={post.comments || []} />
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  center: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  error: {
    color: '#e74c3c',
    marginBottom: '12px',
    fontSize: '14px',
  },
  thumbnail: {
    width: '100%',
    maxHeight: '350px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    color: '#2c3e50',
    marginBottom: '8px',
  },
  meta: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '20px',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.7',
    color: '#333',
    whiteSpace: 'pre-wrap',
  },
  ownerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #eee',
    flexWrap: 'wrap',
  },
  editBtn: {
    padding: '6px 14px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  deleteBtn: {
    padding: '6px 14px',
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  uploadForm: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  fileInput: {
    fontSize: '12px',
  },
  uploadBtn: {
    padding: '6px 12px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  // Edit mode styles
  editForm: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  editTitle: {
    marginBottom: '16px',
    color: '#2c3e50',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '14px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '8px 10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
  },
  saveBtn: {
    padding: '8px 20px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px 20px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};
