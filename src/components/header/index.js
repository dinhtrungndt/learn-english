import React from 'react';

const Header = () => {
  return (
    <nav className="h-[64px] bg-white border-b border-[#E5E5E5] fixed top-0 w-full z-50 flex items-center justify-between px-[20px] min-[900px]:px-[40px]">
      <div className="flex items-center mx-auto max-w-[1440px] w-full justify-between">
        <div className="flex items-center gap-[16px]">
          <img src="https://d35aaqx5ub95lt.cloudfront.net/images/splash/f92d5f2f7d56636846861c458c0d0b6c.svg" alt="Duolingo" className="w-[140px] h-[33px]" />
          <div className="w-[1px] h-[24px] bg-[#E5E5E5]"></div>
          <span className="text-[11px] font-bold uppercase tracking-[1.5px] text-[#AFAFAF]">Style Guide</span>
        </div>
        <div className="hidden min-[900px]:flex items-center gap-[24px]">
          {['Colors', 'Type', 'Buttons', 'Cards', 'Components'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] font-bold uppercase tracking-[0.5px] text-[#AFAFAF] hover:text-[#58CC02] hover:bg-[#58CC02]/10 px-[12px] py-[8px] rounded-[12px] transition-colors">
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
