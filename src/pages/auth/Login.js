import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.detail || 'Tài khoản hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  /* ─── inline styles ─── */
  const field = {
    width: '100%',
    height: 52,
    padding: '0 18px',
    background: 'var(--surface)',
    border: '2px solid transparent',
    borderRadius: 16,
    fontSize: 15,
    fontWeight: 600,
    color: '#4B4B4B',
    fontFamily: 'var(--font)',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
  };

  const socialBtn = {
    width: 52,
    height: 52,
    borderRadius: 14,
    background: 'var(--surface)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 900,
    fontFamily: 'var(--font)',
    transition: 'background 0.15s',
  };

  return (
    <div style={{
      minHeight: '100svh',
      width: '100%',
      background: 'var(--green)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* ── Top green area ── */}
      <div style={{
        padding: '50px 24px 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>
        {/* Mascot */}
        <div style={{
          width: 80, height: 80,
          background: 'white',
          borderRadius: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }}>
          🦉
        </div>
        <h1 style={{
          color: 'white',
          fontSize: 36,
          fontWeight: 900,
          fontFamily: 'var(--font)',
          letterSpacing: '-0.5px',
        }}>
          Learn E
        </h1>
      </div>

      {/* ── White card ── */}
      <div style={{
        flex: 1,
        width: '100%',
        background: 'white',
        borderRadius: '32px 32px 0 0',
        padding: '28px 24px 32px',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <h2 style={{
            fontSize: 22,
            fontWeight: 900,
            color: '#4B4B4B',
            fontFamily: 'var(--font)',
          }}>
            Đăng nhập
          </h2>
          <p style={{
            fontSize: 14,
            color: '#888',
            fontWeight: 600,
            marginTop: 4,
            fontFamily: 'var(--font)',
          }}>
            để tiếp tục vươn tới mục tiêu!
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color: 'var(--red)',
            fontSize: 14,
            fontWeight: 600,
            textAlign: 'center',
            background: 'rgba(255,75,75,0.1)',
            padding: '12px 16px',
            borderRadius: 12,
            fontFamily: 'var(--font)',
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <input
          type="text"
          placeholder="Tên đăng nhập / Email"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={field}
          onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.background = 'white'; }}
          onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--surface)'; }}
        />

        {/* Password */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Mật khẩu"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{ ...field, paddingRight: 48 }}
            onFocus={e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.background = 'white'; }}
            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--surface)'; }}
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{
              position: 'absolute',
              right: 14,
              fontSize: 18,
              color: 'var(--gray)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </span>
        </div>

        {/* Forgot */}
        <div style={{ textAlign: 'right', marginTop: -4 }}>
          <span style={{
            fontSize: 12,
            color: '#777',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'var(--font)',
          }}>
            Quên mật khẩu?
          </span>
        </div>

        {/* Submit */}
        <DuoButton type="submit" variant="primary" disabled={loading} onClick={handleLogin}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </DuoButton>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 13,
          color: '#999',
          fontWeight: 600,
          fontFamily: 'var(--font)',
        }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          hoặc tiếp tục với
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Social */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button style={{ ...socialBtn, color: '#EA4335' }}>G</button>
          <button style={{ ...socialBtn, color: '#1877F2' }}>f</button>
          <button style={socialBtn}>🍎</button>
        </div>

        {/* Sign up link */}
        <div style={{
          textAlign: 'center',
          marginTop: 8,
          fontSize: 14,
          color: '#888',
          fontWeight: 600,
          fontFamily: 'var(--font)',
        }}>
          Chưa có tài khoản?{' '}
          <span
            onClick={() => navigate('/signup')}
            style={{ color: 'var(--green)', fontWeight: 900, cursor: 'pointer' }}
          >
            Đăng ký ngay!
          </span>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
