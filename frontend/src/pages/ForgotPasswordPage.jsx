import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await api.put('/auth/forget', { email, newPass });
      setSuccess(res.data.message || 'Password changed!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.btn}>Change Password</button>
        </form>
        <p style={styles.footerText}>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 60px)',
    backgroundColor: '#f5f6fa',
  },
  card: {
    backgroundColor: '#fff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
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
  btn: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e67e22',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '8px',
  },
  footerText: {
    textAlign: 'center',
    fontSize: '13px',
    marginTop: '12px',
    color: '#666',
  },
};
