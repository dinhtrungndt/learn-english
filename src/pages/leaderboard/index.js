import React, { useState, useEffect } from 'react';
import { getLeaderboard } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await getLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error("Lỗi tải bảng xếp hạng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { color: '#FFD700', bg: 'bg-[#FFD700]/10' }; // Gold
      case 1: return { color: '#C0C0C0', bg: 'bg-[#C0C0C0]/10' }; // Silver
      case 2: return { color: '#CD7F32', bg: 'bg-[#CD7F32]/10' }; // Bronze
      default: return { color: '#AFAFAF', bg: 'bg-transparent' };
    }
  };

  const getLeagueData = (xp) => {
    if (xp >= 500) return { name: "Giải Vàng", icon: "🥇" };
    if (xp >= 100) return { name: "Giải Bạc", icon: "🥈" };
    return { name: "Giải Đồng", icon: "🥉" };
  };

  return (
    <div className="w-full flex flex-col min-h-full pb-[40px] bg-[#F7F7F7]">
      
      {/* Header */}
      <div className="flex flex-col items-center justify-center px-[16px] py-[24px] bg-white border-b-2 border-[#E5E5E5] sticky top-0 z-10">
        <div className="text-[40px] mb-[8px]">🛡️</div>
        <h1 className="text-[20px] font-bold text-[#4B4B4B]">Bảng Xếp Hạng</h1>
        <p className="text-[14px] font-[500] text-[#AFAFAF]">Cạnh tranh điểm XP với mọi người</p>
      </div>

      {/* Leaderboard List */}
      <div className="flex-1 flex flex-col px-[16px] pt-[24px] gap-[12px]">
        {loading ? (
          <div className="flex justify-center py-[40px]">
            <div className="animate-spin w-8 h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full"></div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[24px] text-center flex flex-col items-center">
            <span className="text-[40px] mb-[12px]">😴</span>
            <p className="text-[15px] font-[600] text-[#777777] mb-[8px]">Chưa có ai học cả</p>
            <p className="text-[13px] text-[#AFAFAF] font-[500]">Hãy là người đầu tiên ghi điểm XP!</p>
          </div>
        ) : (
          leaderboard.map((player, index) => {
            const isMe = player.id === user?.id;
            const style = getRankStyle(index);
            const firstLetter = player.name ? player.name.charAt(0).toUpperCase() : 'U';
            
            return (
              <div 
                key={player.id} 
                className={`flex items-center gap-[12px] p-[16px] rounded-[16px] border-2 transition-all ${isMe ? 'border-[#1CB0F6] bg-[#1CB0F6]/5' : 'border-[#E5E5E5] bg-white'}`}
              >
                {/* Rank Number */}
                <div 
                  className={`w-[32px] h-[32px] rounded-full flex items-center justify-center font-bold text-[15px] ${style.bg}`}
                  style={{ color: style.color !== '#AFAFAF' ? style.color : '#777' }}
                >
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className="w-[48px] h-[48px] rounded-full bg-[#CE82FF] flex items-center justify-center text-white text-[20px] font-bold shrink-0">
                  {firstLetter}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-[6px]">
                    <span className={`text-[16px] font-bold ${isMe ? 'text-[#1CB0F6]' : 'text-[#4B4B4B]'}`}>
                      {player.name}
                    </span>
                    {isMe && (
                      <span className="text-[10px] font-bold text-white bg-[#1CB0F6] px-[6px] py-[2px] rounded-[4px] uppercase tracking-wide">
                        Bạn
                      </span>
                    )}
                  </div>
                  <span className="text-[13px] font-[500] text-[#AFAFAF]">@{player.username}</span>
                </div>

                {/* XP */}
                <div className="flex flex-col items-end">
                  <span className="text-[16px] font-bold text-[#FFC800]">{player.xp || 0} XP</span>
                  <span className="text-[12px] font-[600] text-[#AFAFAF]">{getLeagueData(player.xp).name}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
