import React from 'react';

const Toggle = ({ checked, onChange, label }) => (
  <div className="flex items-center gap-[12px] cursor-pointer" onClick={onChange}>
    <div className={`w-[48px] h-[28px] rounded-[14px] p-[3px] transition-colors duration-300 relative ${checked ? 'bg-[#58CC02]' : 'bg-[#E5E5E5]'}`}>
      <div className={`w-[22px] h-[22px] bg-white rounded-full shadow-[1px_3px_rgba(0,0,0,0.15)] transition-transform duration-300 ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`}></div>
    </div>
    {label && <span className="text-[14px] font-[600] text-[#4B4B4B]">{label}</span>}
  </div>
);

export default Toggle;
