import React from 'react';

const Footer = () => {
  return (
    <footer className="py-[40px] bg-white border-t border-[#E5E5E5] text-center">
      <div className="max-w-[1440px] mx-auto px-[20px]">
        <p className="text-[13px] font-bold text-[#AFAFAF] uppercase tracking-[1px]">
          &copy; {new Date().getFullYear()} Duolingo Style Guide. Not officially affiliated with Duolingo.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
