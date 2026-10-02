import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user, checkAuth } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    username: user?.username || '',
    gender: user?.gender || '',
    birth: user?.birth || '',
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.put('/profile', form);
      setSuccess('Profile updated!');
      setEditing(false);
      await checkAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e) => {
    e.preventDefault();
    if (!avatarFile) return;
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    try {
      await api.put('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Avatar updated!');
      await checkAuth();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload avatar');
    }
  };

  if (!user) return <div style={styles.center}>Please log in first.</div>;

  const avatarUrl = user.avatar ? `http://localhost:3001/${user.avatar}` : null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>My Profile</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.avatarSection}>
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" style={styles.avatar} />
          ) : (
            <div style={styles.avatarPlaceholder}>
              {user.username ? user.username[0].toUpperCase() : '?'}
            </div>
          )}
          <form onSubmit={handleAvatarUpload} style={styles.uploadForm}>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              style={styles.fileInput}
            />
            <button type="submit" style={styles.uploadBtn}>Upload Avatar</button>
          </form>
        </div>

        {editing ? (
          <form onSubmit={handleUpdateProfile}>
            <div style={styles.field}>
              <label style={styles.label}>Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.row}>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Gender</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  style={styles.input}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div style={{ ...styles.field, flex: 1 }}>
                <label style={styles.label}>Date of Birth</label>
                <input
                  name="birth"
                  type="date"
                  value={form.birth || ''}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            </div>
            <div style={styles.editActions}>
              <button type="submit" style={styles.saveBtn}>Save</button>
              <button type="button" onClick={() => setEditing(false)} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={styles.info}>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Username:</span>
              <span>{user.username}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Email:</span>
              <span>{user.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Gender:</span>
              <span>{user.gender || 'Not set'}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Date of Birth:</span>
              <span>{user.birth || 'Not set'}</span>
            </div>
            <button onClick={() => setEditing(true)} style={styles.editBtn}>Edit Profile</button>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '24px 16px',
  },
  center: {
    textAlign: 'center',
    padding: '40px',
    color: '#888',
  },
  card: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '20px',
  },
  error: {
    color: '#e74c3c',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  success: {
    color: '#27ae60',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '12px',
  },
  avatarSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '24px',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '12px',
  },
  avatarPlaceholder: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '12px',
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
    padding: '4px 12px',
    backgroundColor: '#8e44ad',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  info: {},
  infoRow: {
    display: 'flex',
    padding: '8px 0',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
  },
  infoLabel: {
    width: '120px',
    fontWeight: '600',
    color: '#555',
  },
  field: {
    marginBottom: '14px',
  },
  row: {
    display: 'flex',
    gap: '12px',
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
  editBtn: {
    marginTop: '16px',
    padding: '8px 20px',
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
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
