import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { useAuth } from '../../contexts/AuthContext';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register({ email, password, username, name: username, role: 'student' });
      navigate('/login');
    } catch (err) {
      setError(err.detail || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  /* ─── shared styles ─── */
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

  const focusField = e => { e.target.style.borderColor = 'var(--blue)'; e.target.style.background = 'white'; };
  const blurField = e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'var(--surface)'; };

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
        <div style={{
          width: 80, height: 80,
          background: 'white',
          borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44,
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
        }}>
          🦉
        </div>
        <h1 style={{
          color: 'white', fontSize: 36, fontWeight: 900,
          fontFamily: 'var(--font)', letterSpacing: '-0.5px',
        }}>
          Learn E
        </h1>
      </div>

      {/* ── White card ── */}
      <div style={{
        flex: 1, width: '100%',
        background: 'white',
        borderRadius: '32px 32px 0 0',
        padding: '28px 24px 32px',
        boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
        display: 'flex', flexDirection: 'column', gap: 14,
      }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4B4B4B', fontFamily: 'var(--font)' }}>
            Tạo tài khoản
          </h2>
          <p style={{ fontSize: 14, color: '#888', fontWeight: 600, marginTop: 4, fontFamily: 'var(--font)' }}>
            và bắt đầu học tập ngay hôm nay!
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            color: 'var(--red)', fontSize: 14, fontWeight: 600,
            textAlign: 'center', background: 'rgba(255,75,75,0.1)',
            padding: '12px 16px', borderRadius: 12, fontFamily: 'var(--font)',
          }}>
            {error}
          </div>
        )}

        {/* Username */}
        <input
          type="text" placeholder="Tên đăng nhập"
          value={username} onChange={e => setUsername(e.target.value)} required
          style={field} onFocus={focusField} onBlur={blurField}
        />

        {/* Email */}
        <input
          type="email" placeholder="Email"
          value={email} onChange={e => setEmail(e.target.value)} required
          style={field} onFocus={focusField} onBlur={blurField}
        />

        {/* Password */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu"
            value={password} onChange={e => setPassword(e.target.value)} required
            style={{ ...field, paddingRight: 48 }}
            onFocus={focusField} onBlur={blurField}
          />
          <span
            onClick={() => setShowPassword(v => !v)}
            style={{ position: 'absolute', right: 14, fontSize: 18, color: 'var(--gray)', cursor: 'pointer', userSelect: 'none' }}
          >
            {showPassword ? '👁️‍🗨️' : '👁️'}
          </span>
        </div>

        {/* Confirm password */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input
            type={showConfirmPassword ? 'text' : 'password'} placeholder="Nhập lại mật khẩu"
            value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
            style={{ ...field, paddingRight: 48 }}
            onFocus={focusField} onBlur={blurField}
          />
          <span
            onClick={() => setShowConfirmPassword(v => !v)}
            style={{ position: 'absolute', right: 14, fontSize: 18, color: 'var(--gray)', cursor: 'pointer', userSelect: 'none' }}
          >
            {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
          </span>
        </div>

        {/* Social link row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginTop: 4,
        }}>
          <span style={{ fontSize: 13, color: '#777', fontWeight: 700, fontFamily: 'var(--font)' }}>
            Liên kết tài khoản
          </span>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { label: 'f', bg: '#1877F2', color: 'white' },
              { label: '🍎', bg: '#1a1a1a', color: 'white' },
            ].map(({ label, bg, color }) => (
              <button
                key={label}
                style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: bg, border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, fontWeight: 900, color, fontFamily: 'var(--font)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Terms checkbox */}
        <div
          style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer', marginTop: 8 }}
          onClick={() => setAgreed(v => !v)}
        >
          <div style={{
            width: 24, height: 24, flexShrink: 0,
            borderRadius: 8,
            border: `2px solid ${agreed ? 'var(--green)' : 'var(--border)'}`,
            background: agreed ? 'var(--green)' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}>
            {agreed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            )}
          </div>
          <span style={{ fontSize: 13, color: '#777', fontWeight: 500, lineHeight: 1.5, fontFamily: 'var(--font)' }}>
            Tôi đã đọc và đồng ý với{' '}
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>Chính sách bảo mật</span>{' '}
            của ứng dụng.
          </span>
        </div>

        {/* Submit */}
        <DuoButton type="submit" variant="primary" disabled={!agreed || loading} onClick={handleSignup}>
          {loading ? 'Đang xử lý...' : 'Đăng ký'}
        </DuoButton>

        {/* Login link */}
        <div style={{
          textAlign: 'center',
          fontSize: 14, color: '#888', fontWeight: 600, fontFamily: 'var(--font)',
        }}>
          Đã có tài khoản?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: 'var(--green)', fontWeight: 900, cursor: 'pointer' }}
          >
            Đăng nhập
          </span>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
