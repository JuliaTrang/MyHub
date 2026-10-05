import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import theme from '../theme';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (newPass !== confirmPass) { setError('Passwords do not match!'); return; }
    if (newPass.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const res = await api.put('/auth/forget', { email, newPass });
      setSuccess(res.data.message || 'Password changed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🔑</div>
        <h2 style={s.title}>Reset Password</h2>
        <p style={s.subtitle}>Enter your email and new password</p>

        {error && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              style={s.input} placeholder="your@email.com" required />
          </div>
          <div style={s.field}>
            <label style={s.label}>New Password</label>
            <div style={s.pwWrap}>
              <input type={showPass ? 'text' : 'password'} value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                style={s.input} placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div style={s.field}>
            <label style={s.label}>Confirm New Password</label>
            <input type="password" value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              style={{ ...s.input, borderColor: confirmPass && newPass !== confirmPass ? theme.danger : theme.border }}
              placeholder="Repeat new password" required />
            {confirmPass && newPass !== confirmPass && (
              <span style={s.matchError}>Passwords don't match</span>
            )}
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Saving…' : '🔑 Change Password'}
          </button>
        </form>
        <p style={s.footerText}><Link to="/login" style={s.footerLink}>← Back to Login</Link></p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: 'calc(100vh - 65px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', background: `linear-gradient(135deg, #fef3c7 0%, #fce7f3 100%)`, padding: '24px 16px',
  },
  card: {
    background: '#fff', borderRadius: theme.radiusLg, padding: '40px 36px',
    width: '100%', maxWidth: '420px', boxShadow: theme.shadow, border: `1px solid ${theme.border}`, textAlign: 'center',
  },
  icon: { fontSize: '48px', marginBottom: '16px' },
  title: { fontSize: '26px', fontWeight: '800', color: theme.text, marginBottom: '6px' },
  subtitle: { color: theme.textMuted, fontSize: '14px', marginBottom: '28px', fontWeight: '600' },
  errorBox: { background: theme.dangerLight, color: theme.danger, padding: '10px 16px', borderRadius: theme.radiusSm, fontSize: '13px', fontWeight: '600', marginBottom: '16px' },
  successBox: { background: theme.successLight, color: '#065f46', padding: '10px 16px', borderRadius: theme.radiusSm, fontSize: '13px', fontWeight: '600', marginBottom: '16px' },
  form: { textAlign: 'left' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: theme.text, marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 16px', border: `2px solid ${theme.border}`, borderRadius: theme.radiusSm,
    fontSize: '14px', fontFamily: 'Nunito, sans-serif', color: theme.text,
    outline: 'none', boxSizing: 'border-box', background: '#faf8ff',
  },
  pwWrap: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  matchError: { color: theme.danger, fontSize: '12px', fontWeight: '600', marginTop: '4px', display: 'block' },
  btn: {
    width: '100%', padding: '13px',
    background: `linear-gradient(135deg, ${theme.peach}, ${theme.coral})`,
    color: '#fff', border: 'none', borderRadius: theme.radiusSm,
    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', marginTop: '8px',
    boxShadow: '0 4px 16px rgba(251,146,60,0.35)',
  },
  footerText: { color: theme.textMuted, fontSize: '13px', marginTop: '20px', fontWeight: '600' },
  footerLink: { color: theme.primaryDark, fontWeight: '700' },
};
