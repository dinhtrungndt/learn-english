import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DuoButton from '../../components/ui/DuoButton';

const ProfilePage = () => {
  const { user, logout } = useAuth();

  // Tạo avatar từ chữ cái đầu của tên
  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Định dạng ngày tham gia
  const joinDate = user?.created_at ? new Date(user.created_at) : new Date();
  const joinMonth = joinDate.getMonth() + 1;
  const joinYear = joinDate.getFullYear();

  return (
    <div className="w-full flex flex-col bg-white min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-[16px] py-[16px] border-b-2 border-[#E5E5E5] sticky top-0 bg-white z-10">
        <h1 className="text-[20px] font-bold text-[#4B4B4B]">Hồ sơ</h1>
        <div className="w-[32px] h-[32px] flex items-center justify-center cursor-pointer text-[#AFAFAF] hover:text-[#4B4B4B]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </div>
      </div>

      {/* User Info Section */}
      <div className="px-[16px] pt-[24px] pb-[16px] flex items-center gap-[16px]">
        <div className="w-[80px] h-[80px] rounded-full bg-[#CE82FF] flex items-center justify-center text-white text-[32px] font-bold shadow-sm border-[3px] border-white ring-2 ring-[#E5E5E5] shrink-0">
          {firstLetter}
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <h2 className="text-[24px] font-bold text-[#4B4B4B] leading-tight">{user?.name || 'Học viên'}</h2>
          <span className="text-[15px] font-[500] text-[#AFAFAF]">@{user?.username || 'user'}</span>
          <span className="text-[13px] font-[600] text-[#1CB0F6] mt-[4px]">Tham gia từ tháng {joinMonth}, {joinYear}</span>
        </div>
      </div>

      <div className="px-[16px] pb-[24px] border-b-2 border-[#E5E5E5]">
        <div className="flex gap-[8px] mt-[8px]">
          <span className="text-[14px] font-[600] text-[#777777]"><span className="text-[#4B4B4B] font-bold">12</span> Đang theo dõi</span>
          <span className="text-[14px] font-[600] text-[#777777]"><span className="text-[#4B4B4B] font-bold">5</span> Người theo dõi</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-[16px] py-[24px] border-b-2 border-[#E5E5E5]">
        <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-[16px]">Thống kê</h3>
        <div className="grid grid-cols-2 gap-[12px]">
          {/* Streak */}
          <div className="border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex gap-[12px] items-center">
            <div className="text-[#FF9600] text-[24px]">🔥</div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#4B4B4B]">12</span>
              <span className="text-[13px] font-[600] text-[#AFAFAF]">Ngày streak</span>
            </div>
          </div>
          {/* XP */}
          <div className="border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex gap-[12px] items-center">
            <div className="text-[#FFC800] text-[24px]">⚡</div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#4B4B4B]">450</span>
              <span className="text-[13px] font-[600] text-[#AFAFAF]">Tổng XP</span>
            </div>
          </div>
          {/* League */}
          <div className="border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex gap-[12px] items-center">
            <div className="text-[#CE82FF] text-[24px]">🛡️</div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#4B4B4B]">Bạc</span>
              <span className="text-[13px] font-[600] text-[#AFAFAF]">Giải đấu</span>
            </div>
          </div>
          {/* Top 3 */}
          <div className="border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex gap-[12px] items-center">
            <div className="text-[#FFD900] text-[24px]">👑</div>
            <div className="flex flex-col">
              <span className="text-[18px] font-bold text-[#4B4B4B]">0</span>
              <span className="text-[13px] font-[600] text-[#AFAFAF]">Lần Top 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action / Logout */}
      <div className="px-[16px] py-[32px] mt-auto">
        <DuoButton 
          variant="danger" 
          className="w-full"
          onClick={() => logout()}
        >
          Đăng xuất
        </DuoButton>
      </div>

    </div>
  );
};

export default ProfilePage;
