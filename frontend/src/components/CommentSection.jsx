import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function CommentSection({ postId, comments: initialComments }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState('');

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.post(`/comment/${postId}`, { content: newComment });
      setNewComment('');
      setError('');
      // Refresh comments by re-fetching the post
      const res = await api.get('/post');
      const updatedPost = res.data.allPosts?.find((p) => p.id === postId);
      if (updatedPost) {
        setComments(updatedPost.comments || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add comment');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comment/${commentId}`);
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const handleStartEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      await api.put(`/comment/${commentId}`, { content: editContent });
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content: editContent } : c
        )
      );
      setEditingId(null);
      setEditContent('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  return (
    <div style={styles.section}>
      <h3 style={styles.heading}>Comments ({comments.length})</h3>

      {error && <p style={styles.error}>{error}</p>}

      {user && (
        <form onSubmit={handleAddComment} style={styles.form}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            style={styles.textarea}
            rows={3}
          />
          <button type="submit" style={styles.submitBtn}>Post Comment</button>
        </form>
      )}

      {comments.length === 0 && (
        <p style={styles.noComments}>No comments yet. Be the first!</p>
      )}

      {comments.map((comment) => (
        <div key={comment.id} style={styles.comment}>
          {editingId === comment.id ? (
            <div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={styles.textarea}
                rows={2}
              />
              <div style={styles.editActions}>
                <button onClick={() => handleSaveEdit(comment.id)} style={styles.saveBtn}>Save</button>
                <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.commentHeader}>
                <strong style={styles.commentAuthor}>
                  {comment.author ? comment.author.username : 'User'}
                </strong>
              </div>
              <p style={styles.commentContent}>{comment.content}</p>
              {user && comment.author && comment.author.username === user.username && (
                <div style={styles.commentActions}>
                  <button onClick={() => handleStartEdit(comment)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(comment.id)} style={styles.deleteBtn}>Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  section: {
    marginTop: '24px',
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  heading: {
    fontSize: '16px',
    marginBottom: '12px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '13px',
    marginBottom: '8px',
  },
  form: {
    marginBottom: '16px',
  },
  textarea: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  submitBtn: {
    marginTop: '6px',
    padding: '6px 16px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  noComments: {
    color: '#999',
    fontSize: '14px',
    fontStyle: 'italic',
  },
  comment: {
    padding: '10px',
    borderBottom: '1px solid #f0f0f0',
  },
  commentHeader: {
    marginBottom: '4px',
  },
  commentAuthor: {
    fontSize: '13px',
    color: '#2c3e50',
  },
  commentContent: {
    fontSize: '14px',
    color: '#444',
    margin: '4px 0',
  },
  commentActions: {
    display: 'flex',
    gap: '8px',
  },
  editActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  editBtn: {
    background: 'none',
    border: 'none',
    color: '#3498db',
    cursor: 'pointer',
    fontSize: '12px',
    padding: 0,
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '12px',
    padding: 0,
  },
  saveBtn: {
    padding: '4px 12px',
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  cancelBtn: {
    padding: '4px 12px',
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
};
