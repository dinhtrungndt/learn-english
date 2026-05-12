import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const S = {
  green: '#58CC02',
  greenLight: '#EDFBD0',
  gray: '#AFAFAF',
  border: '#E5E5E5',
  bg: '#FFFFFF',
};

const tabs = [
  {
    id: 'home',
    path: '/',
    label: 'Trang chủ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: 'practice',
    path: '/practice',
    label: 'Luyện tập',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: 'leaderboard',
    path: '/leaderboard',
    label: 'Bảng xếp',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="13" width="5" height="9" rx="1.5" />
        <rect x="9.5" y="8" width="5" height="14" rx="1.5" />
        <rect x="17" y="4" width="5" height="18" rx="1.5" />
      </svg>
    ),
  },
  {
    id: 'quests',
    path: '/quests',
    label: 'Nhiệm vụ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    id: 'profile',
    path: '/profile',
    label: 'Hồ sơ',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 100,
      background: S.bg,
      borderTop: `2px solid ${S.border}`,
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 64,
        maxWidth: 480,
        margin: '0 auto',
        padding: '0 8px',
      }}>
        {tabs.map((tab) => {
          const isActive = tab.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              style={{
                flex: 1,
                height: 52,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0 4px',
                borderRadius: 14,
                transition: 'all 0.15s',
                color: isActive ? S.green : S.gray,
                position: 'relative',
              }}
            >
              {/* Active dot indicator */}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  top: 4,
                  width: 4, height: 4,
                  borderRadius: '50%',
                  background: S.green,
                }} />
              )}

              {/* Icon */}
              <span style={{
                width: 40, height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
                background: isActive ? S.greenLight : 'transparent',
                transition: 'background 0.15s',
              }}>
                {tab.icon}
              </span>

              {/* Label */}
              <span style={{
                fontSize: 10,
                fontWeight: isActive ? 800 : 700,
                fontFamily: 'var(--font)',
                letterSpacing: '0.1px',
                lineHeight: 1,
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Footer;
