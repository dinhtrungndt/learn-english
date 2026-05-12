import { useEffect, useState } from 'react';
import { addCustomXP } from '../../services/authService';
import { claimQuestReward, getDailyQuests } from '../../services/questService';

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
  purple: '#CE82FF',
  purpleLight: '#F5EEFF',
  orange: '#FF9600',
  orangeLight: '#FFF3E0',
  yellow: '#FFC800',
  yellowLight: '#FFF8E0',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  cardRadius: '18px',
  btnRadius: '14px',
};

/* ─── Press button ─── */
const PressButton = ({ children, onClick, variant = 'primary', fullWidth, disabled, style }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff' },
    yellow: { bg: S.yellow, shadow: '#d4a600', color: '#7a5c00' },
    ghost: { bg: '#fff', shadow: S.border, color: S.gray },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 50, borderRadius: S.btnRadius,
        background: v.bg, color: v.color,
        border: 'none',
        boxShadow: disabled ? 'none' : `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : undefined,
        transition: 'all .1s',
        letterSpacing: '0.2px',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; } }}
      onMouseUp={e => { if (!disabled) { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; } }}
      onTouchStart={e => { if (!disabled) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; } }}
      onTouchEnd={e => { if (!disabled) { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; } }}
    >
      {children}
    </button>
  );
};

/* ─── Quest accent colors ─── */
const questTheme = {
  xp: { bar: S.yellow, barBg: S.yellowLight, iconBg: '#FFF8E0', accent: '#d4a600' },
  sessions: { bar: S.orange, barBg: S.orangeLight, iconBg: '#FFF3E0', accent: '#cc7a00' },
  words: { bar: S.green, barBg: S.greenLight, iconBg: '#EDFBD0', accent: S.greenDark },
};

/* ─── Quest card ─── */
const QuestCard = ({ quest, onClaim, claiming }) => {
  const { id, title, desc, icon, target, current, isClaimed } = quest;
  const theme = questTheme[id] || questTheme.xp;
  const pct = Math.min(100, (current / target) * 100);
  const isCompleted = current >= target;

  return (
    <div style={{
      background: '#fff',
      border: `2px solid ${isClaimed ? S.border : isCompleted ? theme.accent + '55' : S.border}`,
      borderRadius: S.cardRadius,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      transition: 'border-color .2s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Claimed overlay shimmer */}
      {isClaimed && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(255,255,255,0.55)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Icon */}
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: theme.iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, flexShrink: 0,
        }}>
          {icon}
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
            <span style={{ fontSize: 15, fontWeight: 900, color: S.text }}>{title}</span>
            {isClaimed && (
              <span style={{
                fontSize: 10, fontWeight: 800,
                background: S.greenLight, color: S.greenDark,
                padding: '2px 7px', borderRadius: 6,
                letterSpacing: '0.4px',
              }}>✓ XONG</span>
            )}
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: S.gray }}>{desc}</span>
        </div>

        {/* Reward badge */}
        <div style={{
          flexShrink: 0,
          background: S.yellowLight,
          borderRadius: 10,
          padding: '5px 10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#a07800' }}>+15</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#c4a000' }}>XP</div>
        </div>
      </div>

      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: S.textMuted }}>Tiến độ</span>
          <span style={{
            fontSize: 12, fontWeight: 900,
            color: isCompleted ? theme.accent : S.gray,
          }}>
            {current}/{target}
          </span>
        </div>
        <div style={{
          height: 14, borderRadius: 99,
          background: theme.barBg,
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            borderRadius: 99,
            background: theme.bar,
            transition: 'width .6s cubic-bezier(.4,0,.2,1)',
            position: 'relative',
          }}>
            {/* Shine */}
            {pct > 10 && !isClaimed && (
              <div style={{
                position: 'absolute', top: 2, left: 6, right: 6, height: 4,
                borderRadius: 99,
                background: 'rgba(255,255,255,0.45)',
              }} />
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      {isCompleted && !isClaimed && (
        <PressButton
          variant="yellow"
          fullWidth
          disabled={claiming}
          onClick={() => onClaim(id)}
        >
          {claiming ? '⏳ Đang nhận...' : '🎁 Nhận thưởng +15 XP'}
        </PressButton>
      )}

      {isClaimed && (
        <div style={{
          height: 50, borderRadius: S.btnRadius,
          border: `2px solid ${S.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 8,
          fontSize: 14, fontWeight: 800, color: S.gray,
          background: S.grayLight,
        }}>
          ✅ Đã nhận thưởng hôm nay
        </div>
      )}
    </div>
  );
};

/* ─── Daily reset countdown ─── */
const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calc = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: S.purpleLight,
      borderRadius: 99, padding: '4px 12px',
      fontSize: 12, fontWeight: 800, color: S.purple,
    }}>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      Reset lúc {timeLeft}
    </div>
  );
};

/* ─── Summary strip ─── */
const SummaryStrip = ({ quests }) => {
  const total = quests.length;
  const done = quests.filter(q => q.isClaimed).length;
  const completed = quests.filter(q => q.current >= q.target).length;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: '#fff',
      borderRadius: S.cardRadius,
      border: `2px solid ${S.border}`,
      padding: '12px 16px',
    }}>
      {/* Mini progress circles */}
      {quests.map((q, i) => {
        const theme = questTheme[q.id] || questTheme.xp;
        const isDone = q.current >= q.target;
        const isClaimed = q.isClaimed;
        return (
          <div key={q.id} style={{
            width: 32, height: 32, borderRadius: '50%',
            background: isClaimed ? S.greenLight : isDone ? theme.barBg : S.grayLight,
            border: `2px solid ${isClaimed ? S.green : isDone ? theme.bar : S.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>
            {isClaimed ? '✓' : q.icon}
          </div>
        );
      })}

      <div style={{ flex: 1 }} />
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: S.text }}>
          {done}/{total}
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: S.gray }}>
          đã nhận
        </div>
      </div>
    </div>
  );
};

/* ─── Main page ─── */
const QuestsPage = () => {
  const [quests, setQuests] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => { loadQuests(); }, []);

  const loadQuests = () => setQuests(getDailyQuests());

  const handleClaim = async (type) => {
    setClaiming(true);
    try {
      if (claimQuestReward(type)) {
        await addCustomXP(15);
        loadQuests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  if (!quests) return null;

  const questList = [
    {
      id: 'xp',
      title: 'Thợ săn điểm số',
      desc: 'Đạt 50 XP trong ngày',
      icon: '⚡',
      target: 50,
      current: quests.xp,
      isClaimed: quests.claimed.xp,
    },
    {
      id: 'sessions',
      title: 'Kỷ luật thép',
      desc: 'Hoàn thành 3 vòng Ôn tập',
      icon: '🔥',
      target: 3,
      current: quests.sessions,
      isClaimed: quests.claimed.sessions,
    },
    {
      id: 'words',
      title: 'Mở rộng vốn từ',
      desc: 'Thêm 5 từ vựng mới',
      icon: '🌱',
      target: 5,
      current: quests.words,
      isClaimed: quests.claimed.words,
    },
  ];

  const allClaimed = questList.every(q => q.isClaimed);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
      `}</style>

      <div style={{
        width: '100%',
        minHeight: '100%',
        background: S.grayLight,
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 20px)',
      }}>

        {/* ── Sticky header ── */}
        <div style={{
          background: '#fff',
          borderBottom: `2px solid ${S.border}`,
          padding: '20px 20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <span style={{ fontSize: 36, marginBottom: 6 }}>🎁</span>
          <h1 style={{ fontSize: 20, fontWeight: 900, color: S.text, marginBottom: 4 }}>
            Nhiệm Vụ Hằng Ngày
          </h1>
          <Countdown />
        </div>

        {/* ── Body ── */}
        <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* All done banner */}
          {allClaimed && (
            <div style={{
              background: S.greenLight,
              border: `2px solid ${S.green}`,
              borderRadius: S.cardRadius,
              padding: '16px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'fadeInUp .35s ease',
            }}>
              <span style={{ fontSize: 32 }}>🎉</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: S.greenDark }}>
                  Hoàn thành tất cả!
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: S.greenDark, opacity: 0.8 }}>
                  Quay lại ngày mai để nhận nhiệm vụ mới.
                </div>
              </div>
            </div>
          )}

          {/* Summary */}
          <SummaryStrip quests={questList} />

          {/* Quest cards */}
          {questList.map((q, i) => (
            <div key={q.id} style={{ animation: `fadeInUp .3s ease ${i * 0.07}s both` }}>
              <QuestCard quest={q} onClaim={handleClaim} claiming={claiming} />
            </div>
          ))}

          {/* Info note */}
          <p style={{
            textAlign: 'center', fontSize: 12,
            fontWeight: 600, color: S.gray,
            padding: '4px 0',
          }}>
            Nhiệm vụ reset lúc nửa đêm mỗi ngày
          </p>
        </div>
      </div>
    </>
  );
};

export default QuestsPage;
