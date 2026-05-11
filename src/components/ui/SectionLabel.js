import React from 'react';

const SectionLabel = ({ text, dark }) => (
  <div className="flex items-center mb-[24px]">
    <h3 className={`text-[11px] font-[800] uppercase tracking-[2px] whitespace-nowrap ${dark ? 'text-white/35' : 'text-[#AFAFAF]'}`}>{text}</h3>
    <div className={`h-[1px] flex-1 ml-[16px] ${dark ? 'bg-white/10' : 'bg-[#E5E5E5]'}`}></div>
  </div>
);

export default SectionLabel;
