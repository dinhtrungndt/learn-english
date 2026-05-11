import React from 'react';

const Badge = ({ text, colorHex, dark }) => {
  const isDarkColors = {
    green: '#7ADB2E',
    blue: '#4DC4F8',
    golden: '#FFC800'
  };

  const getThemeVars = () => {
    switch (colorHex) {
      case 'green': return dark ? { text: isDarkColors.green, bg: 'rgba(122, 219, 46, 0.15)' } : { text: 'var(--green)', bg: 'rgba(88, 204, 2, 0.12)' };
      case 'blue': return dark ? { text: isDarkColors.blue, bg: 'rgba(77, 196, 248, 0.15)' } : { text: 'var(--blue)', bg: 'rgba(28, 176, 246, 0.12)' };
      case 'red': return { text: 'var(--red)', bg: 'rgba(255, 75, 75, 0.12)' };
      case 'orange': return { text: 'var(--orange)', bg: 'rgba(255, 150, 0, 0.12)' };
      case 'golden': return dark ? { text: isDarkColors.golden, bg: 'rgba(255, 200, 0, 0.15)' } : { text: '#b8920f', bg: 'rgba(255, 200, 0, 0.15)' };
      default: return { text: 'var(--gray-text)', bg: 'rgba(0,0,0,0.1)' };
    }
  };

  const theme = getThemeVars();

  return (
    <div
      className="px-[10px] py-[4px] rounded-[20px] text-[12px] font-bold uppercase tracking-[0.5px]"
      style={{ color: theme.text, backgroundColor: theme.bg }}
    >
      {text}
    </div>
  );
};

export default Badge;
