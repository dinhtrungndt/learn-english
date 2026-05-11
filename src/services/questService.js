const QUESTS_KEY = 'zen_daily_quests_v1';

const getTodayDateString = () => {
  const today = new Date();
  return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
};

const getDefaultQuests = () => ({
  date: getTodayDateString(),
  xp: 0,
  sessions: 0,
  words: 0,
  claimed: { xp: false, sessions: false, words: false }
});

export const getDailyQuests = () => {
  try {
    const raw = localStorage.getItem(QUESTS_KEY);
    if (!raw) return getDefaultQuests();
    
    const quests = JSON.parse(raw);
    if (quests.date !== getTodayDateString()) {
      return getDefaultQuests(); // Reset sang ngày mới
    }
    return quests;
  } catch {
    return getDefaultQuests();
  }
};

const saveDailyQuests = (quests) => {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
};

export const addQuestProgress = (type, amount = 1) => {
  const quests = getDailyQuests();
  if (type === 'xp') quests.xp += amount;
  if (type === 'sessions') quests.sessions += amount;
  if (type === 'words') quests.words += amount;
  
  saveDailyQuests(quests);
};

export const claimQuestReward = (type) => {
  const quests = getDailyQuests();
  if (quests.claimed[type] === false) {
    quests.claimed[type] = true;
    saveDailyQuests(quests);
    return true;
  }
  return false;
};
