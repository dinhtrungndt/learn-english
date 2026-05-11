import React from 'react';

const ProgressBar = ({ progress, colorClass, dark }) => (
  <div className="flex items-center gap-[12px] w-full">
    <div className={`flex-1 h-[12px] rounded-[6px] overflow-hidden ${dark ? 'bg-white/10' : 'bg-[#E5E5E5]'}`}>
      <div className={`h-full rounded-[6px] transition-all duration-600 ease-in-out ${colorClass}`} style={{ width: `${progress}%` }}></div>
    </div>
    <span className={`text-[12px] font-bold w-[32px] text-right ${dark ? 'text-white/60' : 'text-[#AFAFAF]'}`}>{progress}%</span>
  </div>
);

export default ProgressBar;
