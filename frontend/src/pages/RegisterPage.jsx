import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../theme';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: '', gender: '', birth: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setFieldErrors({});

    // Confirm password validation (frontend bug fix)
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      if (!payload.birth) delete payload.birth;
      if (!payload.gender) delete payload.gender;
      
      const res = await register(payload);
      setSuccess(res.message || 'Registered successfully! Redirecting…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach((e) => { if (e.path) mapped[e.path] = e.msg; });
        setFieldErrors(mapped);
        setError('Please fix the errors below.');
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError(err.message || 'Registration failed. Check server connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🌸</div>
        <h2 style={s.title}>Create Account</h2>
        <p style={s.subtitle}>Join the Knowledge Hub community</p>

        {error && <div style={s.errorBox}>{error}</div>}
        {success && <div style={s.successBox}>{success}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Username</label>
            <input name="username" value={form.username} onChange={handleChange}
              style={{ ...s.input, ...(fieldErrors.username ? s.inputError : {}) }} placeholder="Your display name" required />
            {fieldErrors.username && <span style={s.fieldErr}>{fieldErrors.username}</span>}
          </div>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange}
              style={{ ...s.input, ...(fieldErrors.email ? s.inputError : {}) }} placeholder="you@example.com" required />
            {fieldErrors.email && <span style={s.fieldErr}>{fieldErrors.email}</span>}
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.pwWrap}>
              <input name="password" type={showPass ? 'text' : 'password'} value={form.password}
                onChange={handleChange} style={{ ...s.input, ...(fieldErrors.password ? s.inputError : {}) }} placeholder="Min 6 characters" required />
              <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && <span style={s.fieldErr}>{fieldErrors.password}</span>}
          </div>
          {/* ✅ Bug fix: Confirm password field */}
          <div style={s.field}>
            <label style={s.label}>Confirm Password</label>
            <div style={s.pwWrap}>
              <input name="confirmPassword" type={showConfirm ? 'text' : 'password'}
                value={form.confirmPassword} onChange={handleChange}
                style={{
                  ...s.input,
                  borderColor: form.confirmPassword && form.password !== form.confirmPassword
                    ? theme.danger : theme.border,
                }}
                placeholder="Re-enter your password" required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={s.eyeBtn}>
                {showConfirm ? '🙈' : '👁️'}
              </button>
            </div>
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span style={s.matchError}>Passwords don't match</span>
            )}
          </div>
          <div style={s.row}>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Gender</label>
              <select name="gender" value={form.gender} onChange={handleChange} style={{ ...s.input, ...(fieldErrors.gender ? s.inputError : {}) }}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {fieldErrors.gender && <span style={s.fieldErr}>{fieldErrors.gender}</span>}
            </div>
            <div style={{ ...s.field, flex: 1 }}>
              <label style={s.label}>Date of Birth</label>
              <input name="birth" type="date" value={form.birth} onChange={handleChange} style={{ ...s.input, ...(fieldErrors.birth ? s.inputError : {}) }} />
              {fieldErrors.birth && <span style={s.fieldErr}>{fieldErrors.birth}</span>}
            </div>
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Creating account…' : '🌸 Register'}
          </button>
        </form>

        <p style={s.footerText}>
          Already have an account? <Link to="/login" style={s.footerLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: 'calc(100vh - 65px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `linear-gradient(135deg, #fce7f3 0%, #f0eeff 100%)`,
    padding: '24px 16px',
  },
  card: {
    background: '#fff',
    borderRadius: theme.radiusLg,
    padding: '40px 36px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: theme.shadow,
    border: `1px solid ${theme.border}`,
    textAlign: 'center',
  },
  icon: { fontSize: '48px', marginBottom: '16px' },
  title: { fontSize: '26px', fontWeight: '800', color: theme.text, marginBottom: '6px' },
  subtitle: { color: theme.textMuted, fontSize: '14px', marginBottom: '28px', fontWeight: '600' },
  errorBox: {
    background: theme.dangerLight, color: theme.danger,
    padding: '10px 16px', borderRadius: theme.radiusSm,
    fontSize: '13px', fontWeight: '600', marginBottom: '16px',
  },
  successBox: {
    background: theme.successLight, color: '#065f46',
    padding: '10px 16px', borderRadius: theme.radiusSm,
    fontSize: '13px', fontWeight: '600', marginBottom: '16px',
  },
  form: { textAlign: 'left' },
  field: { marginBottom: '16px' },
  row: { display: 'flex', gap: '12px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '700', color: theme.text, marginBottom: '6px' },
  input: {
    width: '100%', padding: '11px 16px',
    border: `2px solid ${theme.border}`, borderRadius: theme.radiusSm,
    fontSize: '14px', fontFamily: 'Nunito, sans-serif', color: theme.text,
    outline: 'none', boxSizing: 'border-box', background: '#faf8ff', transition: 'border 0.2s',
  },
  inputError: {
    borderColor: theme.danger,
    background: theme.dangerLight,
  },
  fieldErr: {
    display: 'block',
    marginTop: '5px',
    fontSize: '12px',
    fontWeight: '700',
    color: theme.danger,
  },
  pwWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
  },
  matchError: { color: theme.danger, fontSize: '12px', fontWeight: '600', marginTop: '4px', display: 'block' },
  btn: {
    width: '100%', padding: '13px',
    background: `linear-gradient(135deg, ${theme.accent}, ${theme.primary})`,
    color: '#fff', border: 'none', borderRadius: theme.radiusSm,
    fontSize: '15px', fontWeight: '800', cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif', marginTop: '8px',
    boxShadow: '0 4px 16px rgba(249,168,212,0.4)',
  },
  footerText: { color: theme.textMuted, fontSize: '13px', marginTop: '20px', fontWeight: '600' },
  footerLink: { color: theme.primaryDark, fontWeight: '700' },
};
