import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getLeaderboard } from '../../services/authService';

/* ─── Design tokens ─── */
const S = {
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueLight: '#E8F6FD',
  green: '#58CC02',
  greenLight: '#EDFBD0',
  red: '#FF4B4B',
  purple: '#CE82FF',
  purpleLight: '#F5EEFF',
  orange: '#FF9600',
  yellow: '#FFC800',
  yellowLight: '#FFF8E0',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  cardRadius: '18px',
  btnRadius: '14px',
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

/* ─── League tiers ─── */
const getLeagueData = (xp) => {
  if (xp >= 500) return { name: 'Vàng', icon: '🥇', color: S.gold };
  if (xp >= 100) return { name: 'Bạc', icon: '🥈', color: S.silver };
  return { name: 'Đồng', icon: '🥉', color: S.bronze };
};

/* ─── Avatar colors cycle ─── */
const avatarColors = [S.purple, S.blue, S.orange, S.green, '#FF6B6B', '#20C997'];
const getAvatarColor = (id, index) => avatarColors[index % avatarColors.length];

/* ─── Rank badge ─── */
const RankBadge = ({ index }) => {
  const medals = ['🥇', '🥈', '🥉'];
  if (index < 3) {
    return (
      <span style={{ fontSize: 24, lineHeight: 1, width: 36, textAlign: 'center', flexShrink: 0 }}>
        {medals[index]}
      </span>
    );
  }
  return (
    <span style={{
      width: 36, flexShrink: 0,
      fontSize: 14, fontWeight: 900,
      color: S.gray, textAlign: 'center',
    }}>
      {index + 1}
    </span>
  );
};

/* ─── Podium top-3 ─── */
const Podium = ({ top3 }) => {
  if (top3.length < 1) return null;

  const order = [1, 0, 2]; // silver, gold, bronze visual order
  const heights = [80, 108, 64];
  const sizes = [52, 64, 48];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: 12,
      padding: '24px 20px 0',
    }}>
      {order.map((rankIdx) => {
        const player = top3[rankIdx];
        if (!player) return <div key={rankIdx} style={{ flex: 1 }} />;
        const league = getLeagueData(player.xp);
        const avatarColor = getAvatarColor(player.id, rankIdx);
        const firstLetter = player.name ? player.name.charAt(0).toUpperCase() : 'U';
        const podiumH = heights[rankIdx];
        const avatarSize = sizes[rankIdx];
        const isFirst = rankIdx === 0;

        return (
          <div key={player.id} style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}>
            {/* Crown for #1 */}
            {isFirst && (
              <span style={{ fontSize: 20, marginBottom: -4 }}>👑</span>
            )}

            {/* Avatar */}
            <div style={{
              width: avatarSize, height: avatarSize,
              borderRadius: '50%',
              background: avatarColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isFirst ? 26 : 20,
              fontWeight: 900, color: '#fff',
              border: `3px solid #fff`,
              boxShadow: isFirst ? `0 0 0 3px ${S.gold}` : 'none',
            }}>
              {firstLetter}
            </div>

            {/* Name */}
            <span style={{
              fontSize: isFirst ? 13 : 11,
              fontWeight: 800,
              color: S.text,
              textAlign: 'center',
              maxWidth: 80,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {player.name}
            </span>

            {/* XP */}
            <span style={{
              fontSize: 12, fontWeight: 900,
              color: S.yellow,
              background: S.yellowLight,
              padding: '2px 8px', borderRadius: 6,
            }}>
              {player.xp || 0} XP
            </span>

            {/* Podium block */}
            <div style={{
              width: '100%',
              height: podiumH,
              borderRadius: '10px 10px 0 0',
              background: isFirst
                ? `linear-gradient(180deg, #FFE566 0%, #FFC800 100%)`
                : rankIdx === 1
                  ? `linear-gradient(180deg, #E0E0E0 0%, #B0B0B0 100%)`
                  : `linear-gradient(180deg, #E8A87C 0%, #CD7F32 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
            }}>
              {['🥇', '🥈', '🥉'][rankIdx]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Player row ─── */
const PlayerRow = ({ player, index, isMe }) => {
  const league = getLeagueData(player.xp || 0);
  const avatarColor = getAvatarColor(player.id, index);
  const firstLetter = player.name ? player.name.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px',
      borderRadius: S.cardRadius,
      border: `2px solid ${isMe ? S.blue : S.border}`,
      background: isMe ? S.blueLight : '#fff',
      transition: 'all .15s',
    }}>
      <RankBadge index={index} />

      {/* Avatar */}
      <div style={{
        width: 44, height: 44,
        borderRadius: '50%',
        background: avatarColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, color: '#fff',
        flexShrink: 0,
      }}>
        {firstLetter}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <span style={{
            fontSize: 15, fontWeight: 900,
            color: isMe ? S.blue : S.text,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {player.name}
          </span>
          {isMe && (
            <span style={{
              fontSize: 10, fontWeight: 800, color: '#fff',
              background: S.blue, padding: '2px 6px',
              borderRadius: 4, letterSpacing: '0.5px',
              flexShrink: 0,
            }}>BẠN</span>
          )}
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: S.gray }}>
          {league.icon} Giải {league.name}
        </span>
      </div>

      {/* XP */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0,
      }}>
        <span style={{
          fontSize: 16, fontWeight: 900, color: S.yellow,
        }}>
          {(player.xp || 0).toLocaleString()}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: S.gray }}>XP</span>
      </div>
    </div>
  );
};

/* ─── Main page ─── */
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
        console.error('Lỗi tải bảng xếp hạng:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  /* Find current user rank */
  const myRank = leaderboard.findIndex(p => p.id === user?.id);

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        width: '100%',
        minHeight: '100%',
        background: S.grayLight,
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 20px)',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* ── Header ── */}
        <div style={{
          background: '#fff',
          borderBottom: `2px solid ${S.border}`,
          padding: '20px 20px 0',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16 }}>
            <div style={{ fontSize: 36, marginBottom: 6 }}>🏆</div>
            <h1 style={{ fontSize: 22, fontWeight: 900, color: S.text, marginBottom: 2 }}>
              Bảng Xếp Hạng
            </h1>
            <p style={{ fontSize: 13, fontWeight: 600, color: S.gray }}>
              Cạnh tranh điểm XP với mọi người
            </p>

            {/* My rank strip */}
            {!loading && myRank >= 0 && (
              <div style={{
                marginTop: 12,
                padding: '6px 16px',
                background: S.blueLight,
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 800,
                color: S.blue,
              }}>
                Xếp hạng của bạn: #{myRank + 1}
              </div>
            )}
          </div>
        </div>

        {/* ── Body ── */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              border: `4px solid ${S.blue}`, borderTopColor: 'transparent',
              animation: 'spin 1s linear infinite',
            }} />
          </div>
        ) : leaderboard.length === 0 ? (
          <div style={{
            margin: '24px 20px',
            background: '#fff', border: `2px solid ${S.border}`,
            borderRadius: S.cardRadius, padding: 32,
            textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            <span style={{ fontSize: 44, marginBottom: 12 }}>😴</span>
            <p style={{ fontSize: 15, fontWeight: 700, color: S.textMuted, marginBottom: 6 }}>Chưa có ai học cả</p>
            <p style={{ fontSize: 13, color: S.gray, fontWeight: 600 }}>Hãy là người đầu tiên ghi điểm XP!</p>
          </div>
        ) : (
          <>
            {/* Podium */}
            <div style={{ background: '#fff', borderBottom: `2px solid ${S.border}` }}>
              <Podium top3={top3} />
            </div>

            {/* Rest of list */}
            {rest.length > 0 && (
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: S.gray, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 2 }}>
                  Những người khác
                </div>
                {rest.map((player, i) => (
                  <div key={player.id} style={{ animation: `fadeInUp .3s ease ${i * 0.04}s both` }}>
                    <PlayerRow
                      player={player}
                      index={i + 3}
                      isMe={player.id === user?.id}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default LeaderboardPage;
