import React from 'react';

const Header = () => {
  return (
    <nav className="h-[64px] bg-white border-b-2 border-[#E5E5E5] shrink-0 w-full flex items-center justify-between px-[16px]">
      <div className="flex items-center gap-[8px] cursor-pointer hover:bg-gray-50 p-[8px] rounded-[12px] transition-colors">
        <img src="https://d35aaqx5ub95lt.cloudfront.net/vendor/59a90a2cedd48b751a8fd22014768fd7.svg" alt="Course" className="w-[32px] h-[24px] object-cover rounded-[4px] border-2 border-[#E5E5E5]" />
      </div>

      <div className="flex items-center gap-[16px]">
        {/* Streak */}
        <div className="flex items-center gap-[6px] cursor-pointer group hover:bg-gray-50 p-[8px] rounded-[12px] transition-colors">
          <span className="text-[20px] group-active:scale-90 transition-transform">🔥</span>
          <span className="text-[15px] font-[800] text-[#FF9600]">42</span>
        </div>
        
        {/* Gems */}
        <div className="flex items-center gap-[6px] cursor-pointer group hover:bg-gray-50 p-[8px] rounded-[12px] transition-colors">
          <span className="text-[20px] group-active:scale-90 transition-transform">💎</span>
          <span className="text-[15px] font-[800] text-[#1CB0F6]">125</span>
        </div>
        
        {/* Hearts */}
        <div className="flex items-center gap-[6px] cursor-pointer group hover:bg-gray-50 p-[8px] rounded-[12px] transition-colors">
          <span className="text-[20px] group-active:scale-90 transition-transform">❤️</span>
          <span className="text-[15px] font-[800] text-[#FF4B4B]">5</span>
        </div>
      </div>
    </nav>
  );
};

export default Header;
