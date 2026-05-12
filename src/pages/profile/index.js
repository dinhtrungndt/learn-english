import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLeaderboard } from '../../services/authService';

/* ─── Design tokens ─── */
const S = {
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueLight: '#E8F6FD',
  green: '#58CC02',
  greenDark: '#46A302',
  greenLight: '#EDFBD0',
  red: '#FF4B4B',
  redDark: '#EA2B2B',
  redLight: '#FFF0F0',
  purple: '#CE82FF',
  purpleLight: '#F5EEFF',
  orange: '#FF9600',
  orangeLight: '#FFF3E0',
  yellow: '#FFC800',
  yellowLight: '#FFF8E0',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  cardRadius: '18px',
  btnRadius: '14px',
};

/* ─── Press button ─── */
const PressButton = ({ children, onClick, variant = 'primary', fullWidth, style }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff' },
    danger: { bg: S.red, shadow: S.redDark, color: '#fff' },
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
        border: 'none', boxShadow: `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: fullWidth ? '100%' : undefined,
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

/* ─── Stat card ─── */
const StatCard = ({ icon, value, label, valueColor }) => (
  <div style={{
    background: '#fff',
    border: `2px solid ${S.border}`,
    borderRadius: S.cardRadius,
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  }}>
    <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>{icon}</span>
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <span style={{
        fontSize: 20, fontWeight: 900,
        color: valueColor || S.text,
        lineHeight: 1.1,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {value}
      </span>
      <span style={{ fontSize: 12, fontWeight: 700, color: S.gray, marginTop: 2 }}>
        {label}
      </span>
    </div>
  </div>
);

/* ─── League helpers ─── */
const getLeague = (xp) => {
  if (xp >= 500) return { name: 'Vàng', icon: '🥇', color: '#FFD700' };
  if (xp >= 100) return { name: 'Bạc', icon: '🥈', color: '#9E9E9E' };
  return { name: 'Đồng', icon: '🥉', color: '#CD7F32' };
};

/* ─── XP progress to next league ─── */
const XpProgress = ({ xp }) => {
  let nextThreshold, label;
  if (xp < 100) { nextThreshold = 100; label = 'đến Giải Bạc'; }
  else if (xp < 500) { nextThreshold = 500; label = 'đến Giải Vàng'; }
  else { nextThreshold = null; }

  if (!nextThreshold) return (
    <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 700, color: S.yellow }}>
      🏆 Bạn đã đạt Giải Vàng!
    </div>
  );

  const pct = Math.min((xp / nextThreshold) * 100, 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: S.textMuted }}>{xp} XP</span>
        <span style={{ fontSize: 12, fontWeight: 700, color: S.textMuted }}>{nextThreshold} XP {label}</span>
      </div>
      <div style={{
        height: 10, borderRadius: 99,
        background: S.grayLight,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          borderRadius: 99,
          background: `linear-gradient(90deg, ${S.yellow}, ${S.orange})`,
          transition: 'width 1s ease',
        }} />
      </div>
    </div>
  );
};

/* ─── Menu row ─── */
const MenuRow = ({ icon, label, value, accent, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', background: 'none', border: 'none',
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 0',
      cursor: onClick ? 'pointer' : 'default',
      WebkitTapHighlightColor: 'transparent',
      borderBottom: `1px solid ${S.border}`,
    }}
  >
    <span style={{ fontSize: 20, width: 28, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
    <span style={{ flex: 1, fontSize: 15, fontWeight: 700, color: S.text, textAlign: 'left' }}>{label}</span>
    {value && (
      <span style={{ fontSize: 14, fontWeight: 800, color: accent || S.gray }}>{value}</span>
    )}
    {onClick && (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={S.gray} strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    )}
  </button>
);

/* ─── Main page ─── */
const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [rank, setRank] = useState(null);

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const xp = user?.xp || 0;
  const league = getLeague(xp);

  const joinDate = user?.created_at ? new Date(user.created_at) : new Date();
  const joinStr = joinDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!user?.id) return;
    getLeaderboard()
      .then(board => {
        const idx = board.findIndex(u => u.id === user.id);
        setRank(idx >= 0 ? idx + 1 : null);
      })
      .catch(console.error);
  }, [user?.id]);

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:none; } }
      `}</style>

      <div style={{
        width: '100%',
        minHeight: '100%',
        background: S.grayLight,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 20px)',
        animation: 'fadeIn .3s ease',
      }}>

        {/* ── Sticky header ── */}
        <div style={{
          background: '#fff',
          borderBottom: `2px solid ${S.border}`,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: S.text }}>Hồ sơ</h1>
          <button style={{
            width: 34, height: 34,
            background: S.grayLight, border: `2px solid ${S.border}`,
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: S.gray,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* ── Hero: avatar + name ── */}
        <div style={{
          background: '#fff',
          padding: '24px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          borderBottom: `2px solid ${S.border}`,
          marginBottom: 12,
        }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80,
            borderRadius: '50%',
            background: S.purple,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 32, fontWeight: 900, color: '#fff',
            flexShrink: 0,
            border: '3px solid #fff',
            boxShadow: `0 0 0 2px ${S.border}`,
          }}>
            {firstLetter}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{
              fontSize: 22, fontWeight: 900, color: S.text,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              marginBottom: 2,
            }}>
              {user?.name || 'Học viên'}
            </h2>
            <span style={{ fontSize: 14, fontWeight: 600, color: S.gray, display: 'block', marginBottom: 6 }}>
              @{user?.username || 'user'}
            </span>
            <span style={{
              fontSize: 12, fontWeight: 700,
              color: S.blue, background: S.blueLight,
              padding: '3px 10px', borderRadius: 99,
              display: 'inline-block',
            }}>
              📅 {joinStr}
            </span>
          </div>
        </div>

        {/* ── League + XP bar ── */}
        <div style={{
          background: '#fff',
          margin: '0 0 12px',
          padding: '18px 20px',
          borderTop: `2px solid ${S.border}`,
          borderBottom: `2px solid ${S.border}`,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
          }}>
            <span style={{ fontSize: 28 }}>{league.icon}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: league.color }}>
                Giải {league.name}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: S.gray }}>
                {xp.toLocaleString()} XP tích lũy
              </div>
            </div>
            {rank && (
              <div style={{
                marginLeft: 'auto',
                background: S.purpleLight,
                borderRadius: 10,
                padding: '6px 12px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: S.purple }}>#{rank}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: S.purple, opacity: 0.7 }}>Xếp hạng</div>
              </div>
            )}
          </div>
          <XpProgress xp={xp} />
        </div>

        {/* ── Stats grid ── */}
        <div style={{ padding: '0 20px', marginBottom: 12 }}>
          <div style={{
            fontSize: 12, fontWeight: 800, color: S.gray,
            letterSpacing: '0.8px', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Thống kê
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <StatCard icon="🔥" value={user?.streak || 0} label="Ngày streak" valueColor={S.orange} />
            <StatCard icon="⚡" value={(xp).toLocaleString()} label="Tổng XP" valueColor={S.yellow} />
            <StatCard icon={league.icon} value={`Giải ${league.name}`} label="Giải đấu" valueColor={league.color} />
            <StatCard
              icon="🛡️"
              value={rank ? `#${rank}` : '—'}
              label="Xếp hạng"
              valueColor={S.purple}
            />
          </div>
        </div>

        {/* ── Menu ── */}
        <div style={{
          background: '#fff',
          margin: '0 0 12px',
          padding: '4px 20px',
          borderTop: `2px solid ${S.border}`,
          borderBottom: `2px solid ${S.border}`,
        }}>
          <MenuRow icon="📖" label="Từ vựng đã học" value={`${user?.total_words || 0} từ`} accent={S.blue} />
          <MenuRow icon="🎯" label="Độ chính xác" value={user?.accuracy ? `${user.accuracy}%` : '—'} accent={S.green} />
          <MenuRow icon="📅" label="Ngày học liên tiếp" value={`${user?.streak || 0} ngày`} accent={S.orange} />
        </div>

        {/* ── Logout ── */}
        <div style={{ padding: '8px 20px 16px' }}>
          <PressButton variant="danger" fullWidth onClick={() => logout()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Đăng xuất
          </PressButton>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
