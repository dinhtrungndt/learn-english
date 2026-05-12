import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { recordStudySession } from '../../services/authService';
import { getAllVocabularies, getVocabulariesForReview, reviewVocabulary } from '../../services/vocabService';
import { playAudio } from '../../utils/speech';

/* ─────────────────────────────────────────
   DESIGN TOKENS  (tweak once, applies everywhere)
───────────────────────────────────────── */
const S = {
  /* colours */
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueLight: '#E8F6FD',
  green: '#58CC02',
  greenDark: '#46A302',
  greenLight: '#EDFBD0',
  red: '#FF4B4B',
  redDark: '#EA2B2B',
  redLight: '#FFF0F0',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E5E5E5',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',

  /* spacing */
  pagePad: '20px',
  cardRadius: '20px',
  btnRadius: '14px',
  inputH: '60px',
};

/* ─────────────────────────────────────────
   SHARED SMALL COMPONENTS
───────────────────────────────────────── */

/** 3-speed speaker button row */
const SpeakerRow = ({ word, style }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, ...style }}>
    <SpeedBtn label="0.5×" onClick={() => playAudio(word, 'slow')} />
    <MainSpkBtn word={word} />
    <SpeedBtn label="1.5×" onClick={() => playAudio(word, 'fast')} />
  </div>
);

const SpeedBtn = ({ label, onClick }) => (
  <button
    onClick={e => { e.stopPropagation(); onClick(); }}
    style={{
      width: 38, height: 38, borderRadius: '50%',
      background: S.blueLight, border: `2px solid rgba(28,176,246,.2)`,
      color: S.blue, fontSize: 12, fontWeight: 800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer',
    }}
  >{label}</button>
);

const MainSpkBtn = ({ word }) => (
  <button
    onClick={e => { e.stopPropagation(); playAudio(word, 'normal'); }}
    style={{
      width: 54, height: 54, borderRadius: '50%',
      background: S.blue, color: '#fff', border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 0 ${S.blueDark}`,
      cursor: 'pointer',
      transition: 'all .1s',
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"
        stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  </button>
);

/** Duolingo-style 3D press button */
const PressButton = ({ children, onClick, variant = 'primary', fullWidth, disabled, style }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff' },
    danger: { bg: S.red, shadow: S.redDark, color: '#fff' },
    ghost: { bg: '#fff', shadow: S.border, color: S.text, border: `2.5px solid ${S.border}` },
    blue: { bg: S.blue, shadow: S.blueDark, color: '#fff' },
  };
  const v = variants[variant];
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 54,
        borderRadius: S.btnRadius,
        background: v.bg,
        color: v.color,
        border: v.border || 'none',
        boxShadow: `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit',
        fontSize: 16,
        fontWeight: 800,
        letterSpacing: '0.2px',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : undefined,
        transition: 'all .1s',
        ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.cssText += 'box-shadow:none;transform:translateY(4px)'; }}
      onMouseUp={e => { e.currentTarget.style.cssText = e.currentTarget.style.cssText.replace('box-shadow:none;transform:translateY(4px)', ''); }}
    >
      {children}
    </button>
  );
};

/** Feedback banner (correct / incorrect) */
const FeedbackBanner = ({ feedback, correctAnswer }) => {
  if (!feedback) return null;
  const ok = feedback === 'correct';
  return (
    <div style={{
      width: `calc(100% + ${parseInt(S.pagePad) * 2}px)`,
      marginLeft: `-${S.pagePad}`,
      marginTop: -24,
      marginBottom: 20,
      padding: `14px ${S.pagePad}`,
      background: ok ? S.greenLight : S.redLight,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <span style={{ fontSize: 20 }}>{ok ? '🎉' : '💡'}</span>
      <span style={{ fontSize: 15, fontWeight: 800, color: ok ? S.greenDark : S.redDark }}>
        {ok ? 'Xuất sắc! Chính xác!' : `Đáp án đúng: ${correctAnswer}`}
      </span>
    </div>
  );
};

/** Progress header */
const ProgressHeader = ({ currentIndex, total, mistakes, isFreePractice }) => {
  const pct = total > 0 ? (currentIndex / total) * 100 : 0;
  return (
    <div style={{
      padding: `14px ${S.pagePad} 12px`,
      background: '#fff',
      borderBottom: `2px solid ${S.border}`,
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      {/* Row 1: label */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: S.gray }}>
          {isFreePractice ? '🎯 Luyện tập thêm' : '🔥 Ôn tập hàng ngày'}
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ height: 14, background: S.border, borderRadius: 99, overflow: 'hidden', marginBottom: 8 }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${S.green}, #7DE321)`,
          borderRadius: 99, transition: 'width .5s ease',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 2, left: 4, right: 4, height: 4,
            background: 'rgba(255,255,255,.3)', borderRadius: 99,
          }} />
        </div>
      </div>

      {/* Meta row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: S.gray }}>
        <span>Câu {currentIndex} / {total}</span>
        <span style={{ color: mistakes > 0 ? S.red : S.gray }}>❌ Lỗi: {mistakes}</span>
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────
   EXERCISE RENDERERS
───────────────────────────────────────── */

/** Quiz (multiple choice) */
const QuizExercise = ({ vocab, options, label, feedback, selectedId, onSelect }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <FeedbackBanner feedback={feedback} correctAnswer={vocab.meaning} />

    <p style={{ fontSize: 18, fontWeight: 800, color: S.textMuted, marginBottom: 20, textAlign: 'center' }}>
      {label}
    </p>

    <div style={{ textAlign: 'center', marginBottom: 28 }}>
      <div style={{ fontSize: 38, fontWeight: 900, color: S.text, letterSpacing: -1, lineHeight: 1.1 }}>
        {vocab.word}
      </div>
      {vocab.phonetic && (
        <div style={{ fontSize: 14, color: S.gray, fontWeight: 600, marginTop: 4 }}>
          {vocab.phonetic}
        </div>
      )}
      <SpeakerRow word={vocab.word} style={{ justifyContent: 'center', marginTop: 14 }} />
    </div>

    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt, i) => {
        const isCorrect = opt.id === vocab.id;
        const isSelected = opt.id === selectedId;
        let bg = '#fff', border = `2.5px solid ${S.border}`, color = S.text, iconColor = S.gray;
        if (feedback) {
          if (isCorrect) { bg = S.greenLight; border = `2.5px solid ${S.green}`; color = S.greenDark; iconColor = S.green; }
          else if (isSelected) { bg = S.redLight; border = `2.5px solid ${S.red}`; color = S.redDark; iconColor = S.red; }
          else { bg = '#fff'; border = `2.5px solid ${S.border}`; color = S.textMuted; }
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            disabled={!!feedback}
            style={{
              width: '100%', minHeight: 58, padding: '14px 18px',
              borderRadius: S.btnRadius, border, background: bg, color,
              fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
              textAlign: 'left', cursor: feedback ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: feedback && !isCorrect && !isSelected ? 0.45 : 1,
              transition: 'all .2s',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: `2px solid ${iconColor}`, color: iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {feedback
                ? (isCorrect ? '✓' : isSelected ? '✗' : ['A', 'B', 'C', 'D'][i])
                : ['A', 'B', 'C', 'D'][i]}
            </div>
            <span>{opt.meaning}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/** Quiz listen */
const ListenExercise = ({ vocab, options, feedback, selectedId, onSelect }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <FeedbackBanner feedback={feedback} correctAnswer={vocab.meaning} />

    <p style={{ fontSize: 18, fontWeight: 800, color: S.textMuted, marginBottom: 28, textAlign: 'center' }}>
      Nghe và chọn nghĩa đúng
    </p>

    <div style={{
      width: 80, height: 80, borderRadius: '50%',
      background: S.blueLight, border: `3px solid rgba(28,176,246,.2)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 36, marginBottom: 8,
    }}>🔊</div>
    <p style={{ fontSize: 13, fontWeight: 700, color: S.gray, marginBottom: 32 }}>
      Nhấn loa để nghe lại
    </p>
    <SpeakerRow word={vocab.word} style={{ marginBottom: 32 }} />

    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {options.map((opt, i) => {
        const isCorrect = opt.id === vocab.id;
        const isSelected = opt.id === selectedId;
        let bg = '#fff', border = `2.5px solid ${S.border}`, color = S.text, iconColor = S.gray;
        if (feedback) {
          if (isCorrect) { bg = S.greenLight; border = `2.5px solid ${S.green}`; color = S.greenDark; iconColor = S.green; }
          else if (isSelected) { bg = S.redLight; border = `2.5px solid ${S.red}`; color = S.redDark; iconColor = S.red; }
          else { bg = '#fff'; border = `2.5px solid ${S.border}`; color = S.textMuted; }
        }
        return (
          <button
            key={opt.id}
            onClick={() => onSelect(opt)}
            disabled={!!feedback}
            style={{
              width: '100%', minHeight: 58, padding: '14px 18px',
              borderRadius: S.btnRadius, border, background: bg, color,
              fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
              textAlign: 'left', cursor: feedback ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
              opacity: feedback && !isCorrect && !isSelected ? 0.45 : 1,
              transition: 'all .2s',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: `2px solid ${iconColor}`, color: iconColor,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 800, flexShrink: 0,
            }}>
              {feedback
                ? (isCorrect ? '✓' : isSelected ? '✗' : ['A', 'B', 'C', 'D'][i])
                : ['A', 'B', 'C', 'D'][i]}
            </div>
            <span>{opt.meaning}</span>
          </button>
        );
      })}
    </div>
  </div>
);

/** Type word exercise */
const TypeExercise = ({ vocab, feedback, onSubmit }) => {
  const [val, setVal] = useState('');

  const inputColor = feedback === 'correct' ? S.green
    : feedback === 'incorrect' ? S.red
      : S.blue;
  const inputBg = feedback === 'correct' ? S.greenLight
    : feedback === 'incorrect' ? S.redLight
      : S.grayLight;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!feedback) onSubmit(val);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <FeedbackBanner feedback={feedback} correctAnswer={vocab.word} />

      <p style={{ fontSize: 18, fontWeight: 800, color: S.textMuted, marginBottom: 22, textAlign: 'center' }}>
        Viết lại từ này bằng tiếng Anh
      </p>

      {/* Meaning card */}
      <div style={{
        width: '100%',
        background: S.grayLight, border: `2px solid ${S.border}`,
        borderRadius: S.cardRadius, padding: '18px 20px',
        textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{ fontSize: 26, fontWeight: 900, color: S.text }}>{vocab.meaning}</div>
        {vocab.example && (
          <div style={{ fontSize: 14, color: S.textMuted, fontStyle: 'italic', marginTop: 8 }}>
            "{vocab.example}"
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <input
          type="text"
          autoFocus
          placeholder="Gõ từ tiếng Anh..."
          value={val}
          onChange={e => setVal(e.target.value)}
          disabled={!!feedback}
          style={{
            width: '100%', height: S.inputH,
            border: `2.5px solid ${inputColor}`,
            borderRadius: S.btnRadius,
            padding: '0 20px',
            fontFamily: 'inherit', fontSize: 22, fontWeight: 800,
            textAlign: 'center',
            color: inputColor, background: inputBg,
            outline: 'none', transition: 'all .2s',
          }}
        />

        {feedback === 'incorrect' && (
          <div style={{
            background: S.redLight, borderRadius: 14,
            padding: '14px 20px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: S.red, marginBottom: 4 }}>Đáp án đúng là:</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: S.red }}>{vocab.word}</div>
          </div>
        )}

        {!feedback && (
          <PressButton variant="blue" fullWidth>Kiểm tra ✓</PressButton>
        )}
      </form>
    </div>
  );
};

/** Flashcard exercise */
const FlashcardExercise = ({ vocab, onAnswer }) => {
  const [flipped, setFlipped] = useState(false);

  const flip = () => {
    if (!flipped) {
      setFlipped(true);
      playAudio(vocab.word, 'normal');
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* 3-D card */}
      <div style={{ width: '100%', maxWidth: 320, perspective: '1000px', marginBottom: 28 }}>
        <div
          onClick={flip}
          style={{
            width: '100%', height: 340,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transition: 'transform .55s cubic-bezier(.4,0,.2,1)',
            transform: flipped ? 'rotateY(180deg)' : 'none',
            cursor: 'pointer',
          }}
        >
          {/* Front */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: S.cardRadius,
            border: `2.5px solid ${S.border}`,
            background: '#fff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
              color: S.blue, textTransform: 'uppercase',
              background: S.blueLight, padding: '5px 14px',
              borderRadius: 99, marginBottom: 24,
            }}>Từ vựng</span>
            <h2 style={{ fontSize: 36, fontWeight: 900, color: S.text, textAlign: 'center', letterSpacing: -0.5, margin: 0 }}>
              {vocab.word}
            </h2>
            {vocab.phonetic && (
              <div style={{ fontSize: 15, color: S.gray, fontWeight: 600, marginTop: 6 }}>{vocab.phonetic}</div>
            )}
            <div style={{ marginTop: 36, fontSize: 13, fontWeight: 700, color: S.gray }}>
              Chạm để xem nghĩa ✨
            </div>
          </div>

          {/* Back */}
          <div style={{
            position: 'absolute', inset: 0,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            borderRadius: S.cardRadius,
            border: `2.5px solid ${S.blue}`,
            background: '#fff',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 24,
          }}>
            <span style={{
              fontSize: 11, fontWeight: 800, letterSpacing: 1.5,
              color: S.blue, textTransform: 'uppercase',
              background: S.blueLight, padding: '5px 14px',
              borderRadius: 99, marginBottom: 20,
            }}>Ý nghĩa</span>
            <h2 style={{ fontSize: 28, fontWeight: 900, color: S.text, textAlign: 'center', margin: '0 0 16px' }}>
              {vocab.meaning}
            </h2>
            <SpeakerRow word={vocab.word} style={{ marginBottom: 20 }} />
            {vocab.example && (
              <div style={{
                width: '100%', background: S.grayLight,
                borderRadius: 14, padding: 14,
                border: `1.5px solid ${S.border}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: S.gray, marginBottom: 4 }}>Ví dụ:</div>
                <div style={{ fontSize: 14, color: S.text, fontWeight: 600 }}>{vocab.example}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 10, width: '100%' }}>
        {flipped ? (
          <>
            <PressButton variant="danger" style={{ flex: 1 }} onClick={() => onAnswer(false)}>
              😕 Quên rồi
            </PressButton>
            <PressButton variant="primary" style={{ flex: 1 }} onClick={() => onAnswer(true)}>
              ✅ Đã nhớ
            </PressButton>
          </>
        ) : (
          <PressButton variant="blue" fullWidth onClick={flip}>
            🔄 Lật thẻ
          </PressButton>
        )}
      </div>
    </div>
  );
};


/* ─────────────────────────────────────────
   SCREEN: EMPTY STATE
───────────────────────────────────────── */
const EmptyScreen = ({ categoryId, navigate }) => (
  <div style={{ display: 'flex', flexDirection: 'column', background: '#fff', minHeight: '100%' }}>
    {/* Mini header */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: `16px ${S.pagePad}`, borderBottom: `2px solid ${S.border}`,
    }}>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: S.text }}>Ôn tập</h1>
    </div>

    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: `${S.pagePad}`, textAlign: 'center',
    }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: S.grayLight, border: `3px solid ${S.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 44, marginBottom: 24,
      }}>🌱</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: S.text, marginBottom: 8 }}>
        Chưa có từ nào cần ôn
      </h2>
      <p style={{ fontSize: 15, color: S.textMuted, fontWeight: 600, marginBottom: 32, lineHeight: 1.6 }}>
        {categoryId
          ? 'Thư mục này chưa có từ vựng đến hạn ôn tập.'
          : 'Bạn đã ôn hết từ vựng hôm nay rồi!\nHãy xem YouTube và thêm từ mới nhé!'}
      </p>
      <PressButton variant="primary" fullWidth onClick={() => navigate('/add-word')}>
        + Thêm từ mới ngay
      </PressButton>
    </div>
  </div>
);


/* ─────────────────────────────────────────
   SCREEN: COMPLETED
───────────────────────────────────────── */
const CompletedScreen = ({ mistakes, syncing, isFreePractice, onRetry, onHome }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minHeight: '100%', padding: '40px 24px',
    textAlign: 'center', background: '#fff',
  }}>
    <div style={{ fontSize: 72, marginBottom: 16, lineHeight: 1 }}>🎉</div>
    <h2 style={{ fontSize: 26, fontWeight: 900, color: S.text, marginBottom: 8 }}>Tuyệt đỉnh!</h2>

    {syncing ? (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          border: `3px solid ${S.blue}`, borderTopColor: 'transparent',
          animation: 'spin 1s linear infinite', marginBottom: 12,
        }} />
        <p style={{ color: S.gray, fontWeight: 700 }}>Đang lưu kết quả...</p>
      </div>
    ) : (
      <>
        {/* Stats pill */}
        {!isFreePractice && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 16,
            background: S.grayLight, borderRadius: 99,
            padding: '10px 24px', marginBottom: 24,
          }}>
            <Stat label="Lỗi" value={mistakes} color={mistakes > 0 ? S.red : S.green} />
          </div>
        )}

        <p style={{ fontSize: 15, color: S.textMuted, fontWeight: 600, lineHeight: 1.7, marginBottom: 36 }}>
          Bạn đã hoàn thành phiên huấn luyện.<br />
          Trí nhớ đang ngày càng xuất sắc!
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <PressButton variant="primary" fullWidth onClick={onRetry}>
            🔄 Luyện thêm vòng nữa
          </PressButton>
          <PressButton variant="ghost" fullWidth onClick={onHome}>
            🏠 Về Trang Chủ
          </PressButton>
        </div>
      </>
    )}
  </div>
);

const Stat = ({ label, value, color }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 22, fontWeight: 900, color }}>{value}</div>
    <div style={{ fontSize: 12, fontWeight: 700, color: S.gray }}>{label}</div>
  </div>
);


/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const PracticePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category');

  const [vocabList, setVocabList] = useState([]);
  const [allVocabs, setAllVocabs] = useState([]);

  const [exercises, setExercises] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(new Set());
  const [isFreePractice, setIsFreePractice] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const [options, setOptions] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let [reviewData, allData] = await Promise.all([
        getVocabulariesForReview(),
        getAllVocabularies(),
      ]);
      if (categoryId) {
        reviewData = reviewData.filter(v => v.category_id?.toLowerCase() === categoryId.toLowerCase());
      }
      setVocabList(reviewData);
      setAllVocabs(allData);
      if (reviewData.length > 0) startSession(reviewData, allData, false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startSession = (reviewData, allData, freeMode) => {
    setIsFreePractice(freeMode);
    setMistakes(new Set());
    setIsCompleted(false);
    setCurrentIndex(0);
    let exs = [];
    reviewData.forEach(vocab => {
      exs.push({ type: 'flashcard', vocab });
      exs.push({ type: 'type_word', vocab });
      if (allData.length >= 4) {
        exs.push({ type: 'quiz_en_to_vi', vocab });
        exs.push({ type: 'quiz_listen', vocab });
      }
    });
    exs = exs.sort(() => Math.random() - 0.5);
    setExercises(exs);
    setupExercise(0, exs, allData);
  };

  const setupExercise = (index, exs = exercises, all = allVocabs) => {
    const ex = exs[index];
    if (!ex) return;
    setIsFlipped(false);
    setTypedAnswer('');
    setFeedback(null);
    setSelectedOption(null);
    if (ex.type === 'quiz_en_to_vi' || ex.type === 'quiz_listen') {
      let distractors = all.filter(v => v.id !== ex.vocab.id);
      distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      setOptions([ex.vocab, ...distractors].sort(() => 0.5 - Math.random()));
      if (ex.type === 'quiz_listen') setTimeout(() => playAudio(ex.vocab.word), 500);
    }
  };

  const submitAnswer = (isCorrect) => {
    const currentExercise = exercises[currentIndex];
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) playAudio('Correct', 'normal', 'en-US');
    else {
      setMistakes(prev => { const s = new Set(prev); s.add(currentExercise.vocab.id); return s; });
      setExercises(prev => [...prev, { ...currentExercise }]);
    }
    const isFlashcard = currentExercise.type === 'flashcard';
    const delay = isFlashcard ? 0 : (isCorrect ? 900 : 2000);
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      setExercises(latestExercises => {
        if (nextIndex < latestExercises.length) {
          setCurrentIndex(nextIndex);
          setupExercise(nextIndex, latestExercises, allVocabs);
        } else {
          finishSession();
        }
        return latestExercises;
      });
    }, delay);
  };

  const finishSession = async () => {
    setIsCompleted(true);
    if (isFreePractice) return;
    try {
      setSyncing(true);
      const promises = vocabList.map(v => reviewVocabulary(v.id, !mistakes.has(v.id)));
      await Promise.all(promises);
      await recordStudySession();
    } catch (err) {
      console.error('Lỗi đồng bộ:', err);
    } finally {
      setSyncing(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 500 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        border: `4px solid ${S.blue}`, borderTopColor: 'transparent',
        animation: 'spin 1s linear infinite',
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Empty ── */
  if (vocabList.length === 0) return <EmptyScreen categoryId={categoryId} navigate={navigate} />;

  /* ── Completed ── */
  if (isCompleted) return (
    <CompletedScreen
      mistakes={mistakes.size}
      syncing={syncing}
      isFreePractice={isFreePractice}
      onRetry={() => startSession(vocabList, allVocabs, true)}
      onHome={() => navigate('/')}
    />
  );

  /* ── Game ── */
  const currentExercise = exercises[currentIndex];
  if (!currentExercise) return null;
  const currentVocab = currentExercise.vocab;
  const progress = currentIndex / exercises.length * 100;

  const renderGame = () => {
    switch (currentExercise.type) {
      case 'quiz_en_to_vi':
        return (
          <QuizExercise
            vocab={currentVocab}
            options={options}
            label="Nghĩa của từ này là gì?"
            feedback={feedback}
            selectedId={selectedOption}
            onSelect={(opt) => {
              if (feedback) return;
              setSelectedOption(opt.id);
              submitAnswer(opt.id === currentVocab.id);
            }}
          />
        );
      case 'quiz_listen':
        return (
          <ListenExercise
            vocab={currentVocab}
            options={options}
            feedback={feedback}
            selectedId={selectedOption}
            onSelect={(opt) => {
              if (feedback) return;
              setSelectedOption(opt.id);
              submitAnswer(opt.id === currentVocab.id);
            }}
          />
        );
      case 'type_word':
        return (
          <TypeExercise
            vocab={currentVocab}
            feedback={feedback}
            onSubmit={(val) => {
              const correct = val.trim().toLowerCase() === currentVocab.word.toLowerCase();
              submitAnswer(correct);
            }}
          />
        );
      case 'flashcard':
      default:
        return (
          <FlashcardExercise
            vocab={currentVocab}
            onAnswer={submitAnswer}
          />
        );
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', background: '#fff', minHeight: '100%' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)}
          60%{transform:translateX(-6px)}
          80%{transform:translateX(6px)}
        }
        .shake { animation: shake .4s ease; }
      `}</style>

      <ProgressHeader
        currentIndex={currentIndex}
        total={exercises.length}
        mistakes={mistakes.size}
        isFreePractice={isFreePractice}
      />

      <div style={{
        flex: 1,
        padding: `24px ${S.pagePad}`,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {renderGame()}
      </div>
    </div>
  );
};

export default PracticePage;
