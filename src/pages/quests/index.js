import React, { useState, useEffect } from 'react';
import DuoButton from '../../components/ui/DuoButton';
import { getDailyQuests, claimQuestReward } from '../../services/questService';
import { addCustomXP } from '../../services/authService';

const QuestsPage = () => {
  const [quests, setQuests] = useState(null);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    loadQuests();
  }, []);

  const loadQuests = () => {
    setQuests(getDailyQuests());
  };

  const handleClaim = async (type) => {
    setClaiming(true);
    try {
      if (claimQuestReward(type)) {
        await addCustomXP(15);
        loadQuests();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setClaiming(false);
    }
  };

  if (!quests) return null;

  const questList = [
    {
      id: 'xp',
      title: 'Thợ săn điểm số',
      desc: 'Đạt 50 XP trong ngày',
      icon: '⚡',
      target: 50,
      current: quests.xp,
      isClaimed: quests.claimed.xp
    },
    {
      id: 'sessions',
      title: 'Kỷ luật thép',
      desc: 'Hoàn thành 3 vòng Ôn tập',
      icon: '🔥',
      target: 3,
      current: quests.sessions,
      isClaimed: quests.claimed.sessions
    },
    {
      id: 'words',
      title: 'Mở rộng vốn từ',
      desc: 'Thêm 5 từ vựng mới',
      icon: '🌱',
      target: 5,
      current: quests.words,
      isClaimed: quests.claimed.words
    }
  ];

  return (
    <div className="w-full flex flex-col min-h-full pb-[40px] bg-[#F7F7F7]">
      {/* Header */}
      <div className="flex flex-col items-center justify-center px-[16px] py-[24px] bg-white border-b-2 border-[#E5E5E5] sticky top-0 z-10">
        <div className="text-[40px] mb-[8px]">🎁</div>
        <h1 className="text-[20px] font-bold text-[#4B4B4B]">Nhiệm Vụ Hằng Ngày</h1>
        <p className="text-[14px] font-[500] text-[#AFAFAF]">Hoàn thành để nhận thêm XP</p>
      </div>

      <div className="flex-1 flex flex-col px-[16px] pt-[24px] gap-[16px]">
        {questList.map(q => {
          const progress = Math.min(100, (q.current / q.target) * 100);
          const isCompleted = q.current >= q.target;

          return (
            <div key={q.id} className="bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex flex-col gap-[12px]">
              <div className="flex items-center gap-[12px]">
                <div className="text-[32px] w-[48px] h-[48px] bg-[#F7F7F7] flex items-center justify-center rounded-[12px]">
                  {q.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-[16px] font-bold text-[#4B4B4B]">{q.title}</h3>
                  <p className="text-[13px] font-[600] text-[#AFAFAF]">{q.desc}</p>
                </div>
              </div>

              <div className="flex items-center gap-[12px]">
                {/* Progress Bar */}
                <div className="flex-1 h-[16px] bg-[#E5E5E5] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFC800] rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className={`text-[14px] font-bold ${isCompleted ? 'text-[#FFC800]' : 'text-[#AFAFAF]'}`}>
                  {q.current}/{q.target}
                </span>
              </div>

              {isCompleted && !q.isClaimed && (
                <DuoButton 
                  variant="primary" 
                  className="w-full mt-[8px] animate-bounce-soft"
                  onClick={() => handleClaim(q.id)}
                  disabled={claiming}
                >
                  Nhận thưởng +15 XP
                </DuoButton>
              )}

              {q.isClaimed && (
                <DuoButton 
                  variant="ghost" 
                  className="w-full mt-[8px] border-2 border-[#E5E5E5] text-[#AFAFAF] opacity-50"
                  disabled
                >
                  Đã nhận thưởng
                </DuoButton>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestsPage;
