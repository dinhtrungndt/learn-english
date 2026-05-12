
const DuoButton = ({ children, variant = 'primary', size = 'normal', disabled, className = '', ...props }) => {
  const baseClasses = "uppercase font-bold flex items-center justify-center transition-all duration-150 active:translate-y-[4px] active:shadow-none cursor-pointer w-full";
  const sizeClasses = size === 'small' ? "h-[36px] px-[16px] text-[13px] rounded-[10px]" : "h-[48px] px-[24px] text-[15px] rounded-[12px]";

  let variantClasses = "";
  if (variant === 'primary') variantClasses = "bg-[#58CC02] text-white shadow-[0_4px_0_#58A700] hover:bg-[#4BB200]";
  else if (variant === 'secondary') variantClasses = "bg-transparent border-2 border-[#CFCFCF] text-[#1CB0F6] shadow-[0_4px_0_#CFCFCF] hover:bg-gray-50";
  else if (variant === 'danger') variantClasses = "bg-[#FF4B4B] text-white shadow-[0_4px_0_#CC3C3C] hover:bg-[#E54343]";
  else if (variant === 'ghost') variantClasses = "bg-transparent text-[#58CC02] hover:bg-[#58CC02] hover:bg-opacity-[0.08] active:translate-y-0 active:shadow-none";
  else if (variant === 'dark-primary') variantClasses = "bg-white text-[#100F3E] shadow-[0_4px_0_#88879F] hover:bg-[#c8f040]";

  let disabledClasses = disabled ? "opacity-45 pointer-events-none" : "";

  return (
    <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
};

export default DuoButton;
