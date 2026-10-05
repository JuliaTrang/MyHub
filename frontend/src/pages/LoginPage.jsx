import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import theme from '../theme';

// Parse backend error — handles both {message} and {errors:[{msg}]} formats
function parseError(err) {
  const data = err.response?.data;
  if (!data) return 'Connection error. Is the server running?';
  // Validation errors from express-validator via handleValidation
  if (data.errors && Array.isArray(data.errors)) {
    return data.errors.map((e) => e.msg).join(' · ');
  }
  // Business logic errors
  if (data.message) return data.message;
  return 'Something went wrong. Please try again.';
}

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      // If express-validator errors, map them to fields
      if (data?.errors && Array.isArray(data.errors)) {
        const mapped = {};
        data.errors.forEach((e) => { if (e.path) mapped[e.path] = e.msg; });
        setFieldErrors(mapped);
        setError('Please fix the errors below.');
      } else {
        setError(data?.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.icon}>🔐</div>
        <h2 style={s.title}>Welcome back!</h2>
        <p style={s.subtitle}>Sign in to Knowledge Hub</p>

        {error && <div style={s.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: '' })); }}
              style={{ ...s.input, ...(fieldErrors.email ? s.inputError : {}) }}
              placeholder="you@example.com"
              required
            />
            {fieldErrors.email && <span style={s.fieldErr}>{fieldErrors.email}</span>}
          </div>
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.passwordWrap}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '' })); }}
                style={{ ...s.input, ...(fieldErrors.password ? s.inputError : {}) }}
                placeholder="Your password"
                required
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={s.eyeBtn}>
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {fieldErrors.password && <span style={s.fieldErr}>{fieldErrors.password}</span>}
          </div>
          <button type="submit" disabled={loading} style={s.btn}>
            {loading ? 'Signing in…' : '✨ Sign In'}
          </button>
        </form>

        <div style={s.footer}>
          <p style={s.footerText}>
            Don't have an account? <Link to="/register" style={s.footerLink}>Register</Link>
          </p>
          <p style={s.footerText}>
            <Link to="/forgot-password" style={s.footerLink}>Forgot password?</Link>
          </p>
        </div>
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
    background: `linear-gradient(135deg, #f0eeff 0%, #fce7f3 100%)`,
    padding: '24px 16px',
  },
  card: {
    background: '#fff',
    borderRadius: theme.radiusLg,
    padding: '40px 36px',
    width: '100%',
    maxWidth: '420px',
    boxShadow: theme.shadow,
    border: `1px solid ${theme.border}`,
    textAlign: 'center',
  },
  icon: { fontSize: '48px', marginBottom: '16px' },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: theme.text,
    marginBottom: '6px',
  },
  subtitle: {
    color: theme.textMuted,
    fontSize: '14px',
    marginBottom: '28px',
    fontWeight: '600',
  },
  errorBox: {
    background: theme.dangerLight,
    color: theme.danger,
    padding: '10px 16px',
    borderRadius: theme.radiusSm,
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '16px',
  },
  form: { textAlign: 'left' },
  field: { marginBottom: '18px' },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '700',
    color: theme.text,
    marginBottom: '6px',
  },
  input: {
    width: '100%',
    padding: '11px 16px',
    border: `2px solid ${theme.border}`,
    borderRadius: theme.radiusSm,
    fontSize: '14px',
    fontFamily: 'Nunito, sans-serif',
    color: theme.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    background: '#faf8ff',
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
  passwordWrap: { position: 'relative' },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '0',
  },
  btn: {
    width: '100%',
    padding: '13px',
    background: `linear-gradient(135deg, ${theme.primary}, ${theme.accentDark})`,
    color: '#fff',
    border: 'none',
    borderRadius: theme.radiusSm,
    fontSize: '15px',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    boxShadow: '0 4px 16px rgba(167,139,250,0.4)',
    marginTop: '8px',
    transition: 'opacity 0.2s',
  },
  footer: { marginTop: '24px' },
  footerText: {
    color: theme.textMuted,
    fontSize: '13px',
    marginBottom: '6px',
    fontWeight: '600',
  },
  footerLink: {
    color: theme.primaryDark,
    fontWeight: '700',
  },
};
