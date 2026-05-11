import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', path: '/', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { id: 'practice', path: '/practice', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg> },
    { id: 'leaderboard', path: '/leaderboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17"></path></svg> },
    { id: 'quests', path: '/quests', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> },
    { id: 'profile', path: '/profile', icon: <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
  ];

  return (
    <div className="h-[80px] bg-white border-t-2 border-[#E5E5E5] shrink-0 w-full flex items-center justify-around px-[10px] pb-[10px] pt-[6px]">
      {tabs.map((tab) => {
        // Simple active check: if path is '/' it must match exactly, otherwise startswith
        const isActive = tab.path === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.path);
        
        return (
          <div 
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={`w-[56px] h-[56px] flex items-center justify-center rounded-[16px] cursor-pointer transition-all duration-200 active:scale-95 ${isActive ? 'bg-[#58CC02]/10 text-[#58CC02] border-2 border-[#58CC02]/20' : 'text-[#AFAFAF] hover:bg-gray-50 border-2 border-transparent'}`}
          >
            {tab.icon}
          </div>
        );
      })}
    </div>
  );
};

export default Footer;
