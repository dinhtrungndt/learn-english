import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Design tokens ─── */
const S = {
  green: '#58CC02',
  greenDark: '#46A302',
  greenLight: '#EDFBD0',
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueLight: '#E8F6FD',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  btnRadius: '14px',
};

/* ─── Slide data ─── */
const slides = [
  {
    emoji: '📚',
    bg: '#EDFBD0',
    accent: S.green,
    title: 'Lộ trình',
    subtitle: 'linh hoạt',
    desc: 'Nội dung học được cá nhân hóa theo từng mục tiêu để giúp bạn đạt thành quả tốt nhất.',
  },
  {
    emoji: '📱',
    bg: S.blueLight,
    accent: S.blue,
    title: 'Học tập',
    subtitle: 'mọi lúc, mọi nơi',
    desc: 'Không tiện học phát âm ở nơi đông người? Chúng tôi luôn có lựa chọn linh hoạt hơn cho bạn.',
  },
  {
    emoji: '📊',
    bg: '#F5EEFF',
    accent: '#CE82FF',
    title: 'Đánh giá',
    subtitle: 'chuyên sâu',
    desc: 'Theo dõi tiến trình và đánh giá từng kỹ năng dựa trên kết quả thực tế của bạn.',
  },
];

/* ─── Press button (Duolingo 3D style) ─── */
const PressButton = ({ children, onClick, variant = 'primary', style }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff' },
    secondary: { bg: S.greenLight, shadow: '#c5f09e', color: S.green },
    ghost: { bg: '#fff', shadow: S.border, color: S.text },
    blue: { bg: S.blue, shadow: S.blueDark, color: '#fff' },
  };
  const v = variants[variant];

  return (
    <button
      onClick={onClick}
      style={{
        height: 52, borderRadius: S.btnRadius,
        background: v.bg, color: v.color,
        border: 'none',
        boxShadow: `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit', fontSize: 16, fontWeight: 800,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .1s',
        letterSpacing: '0.2px',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseDown={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; }}
      onMouseUp={e => { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; }}
      onTouchStart={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; }}
      onTouchEnd={e => { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; }}
    >
      {children}
    </button>
  );
};

/* ─── Main page ─── */
const OnboardPage = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward
  const navigate = useNavigate();
  const slide = slides[current];
  const isLast = current === slides.length - 1;

  const goNext = () => {
    if (current < slides.length - 1) {
      setDirection(1);
      setCurrent(prev => prev + 1);
    }
  };

  const goBack = () => {
    if (current > 0) {
      setDirection(-1);
      setCurrent(prev => prev - 1);
    }
  };

  const finish = (path) => {
    localStorage.setItem('hasSeenOnboard', 'true');
    navigate(path);
  };

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(.85); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div style={{
        height: '100dvh',
        width: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        /* Safe area */
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}>

        {/* ── Top bar: skip + dots ── */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px 0',
          flexShrink: 0,
        }}>
          {/* Back or placeholder */}
          {current > 0 ? (
            <button
              onClick={goBack}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: S.gray, padding: 4,
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}

          {/* Dots */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrent(idx)}
                style={{
                  height: 8,
                  width: current === idx ? 28 : 8,
                  borderRadius: 99,
                  background: current === idx ? slide.accent : S.border,
                  transition: 'all .3s ease',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Skip */}
          {!isLast ? (
            <button
              onClick={() => finish('/login')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: S.gray, fontSize: 14, fontWeight: 700,
                fontFamily: 'inherit', padding: 4,
              }}
            >
              Bỏ qua
            </button>
          ) : (
            <div style={{ width: 40 }} />
          )}
        </div>

        {/* ── Illustration ── */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          padding: '32px 32px 0',
          gap: 32,
        }}>
          {/* Circle illustration */}
          <div
            key={`emoji-${current}`}
            style={{
              width: 220, height: 220,
              borderRadius: '50%',
              background: slide.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 88,
              animation: 'popIn .4s ease',
              flexShrink: 0,
            }}
          >
            {slide.emoji}
          </div>

          {/* Text */}
          <div
            key={`text-${current}`}
            style={{
              textAlign: 'center',
              animation: 'slideIn .35s ease',
            }}
          >
            <h2 style={{ fontSize: 30, fontWeight: 900, color: S.text, lineHeight: 1.2, marginBottom: 4 }}>
              {slide.title}
            </h2>
            <h2 style={{ fontSize: 30, fontWeight: 900, color: slide.accent, lineHeight: 1.2, marginBottom: 16 }}>
              {slide.subtitle}
            </h2>
            <p style={{
              fontSize: 15, color: S.textMuted, fontWeight: 600,
              lineHeight: 1.65, maxWidth: 300, margin: '0 auto',
            }}>
              {slide.desc}
            </p>
          </div>
        </div>

        {/* ── Bottom buttons ── */}
        <div style={{
          width: '100%',
          padding: '24px 24px 28px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}>
          {isLast ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <PressButton
                variant="secondary"
                style={{ flex: 1 }}
                onClick={() => finish('/login')}
              >
                Đăng nhập
              </PressButton>
              <PressButton
                variant="primary"
                style={{ flex: 1 }}
                onClick={() => finish('/signup')}
              >
                Đăng ký
              </PressButton>
            </div>
          ) : (
            <PressButton
              variant="primary"
              style={{ width: '100%' }}
              onClick={goNext}
            >
              Tiếp tục
            </PressButton>
          )}

          {/* Step counter */}
          <p style={{
            textAlign: 'center', fontSize: 12,
            fontWeight: 700, color: S.gray,
          }}>
            {current + 1} / {slides.length}
          </p>
        </div>
      </div>
    </>
  );
};

export default OnboardPage;
