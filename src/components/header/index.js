import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const mainTabs = ['/', '/practice', '/leaderboard', '/quests', '/profile'];
  const showBack = !mainTabs.includes(location.pathname);

  return (
    <nav style={{
      height: 64,
      background: 'var(--bg)',
      borderBottom: '2px solid var(--border)',
      flexShrink: 0,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px',
    }}>
      {/* Left: back button or flag */}
      {showBack ? (
        <div
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            padding: '8px 10px',
            borderRadius: 12,
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="var(--gray)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </div>
      ) : (
        <div style={{
          width: 36,
          height: 28,
          borderRadius: 6,
          border: '2px solid var(--border)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          cursor: 'pointer',
        }}>
          🇬🇧
        </div>
      )}

      {/* Right: stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[
          { icon: '🔥', value: 42, color: 'var(--orange)' },
          { icon: '💎', value: 125, color: 'var(--blue)' },
          { icon: '❤️', value: 5, color: 'var(--red)' },
        ].map(({ icon, value, color }) => (
          <div
            key={icon}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              padding: '6px 10px',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={{ fontSize: 18 }}>{icon}</span>
            <span style={{
              fontSize: 14,
              fontWeight: 800,
              color,
              fontFamily: 'var(--font)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default Header;
