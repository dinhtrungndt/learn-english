import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, getCategories } from '../../services/categoryService';
import { addVocabulary } from '../../services/vocabService';

/* ─── Design tokens ─── */
const S = {
  blue: '#1CB0F6',
  blueDark: '#1899D6',
  blueLight: '#E8F6FD',
  green: '#58CC02',
  greenDark: '#46A302',
  greenLight: '#EDFBD0',
  red: '#FF4B4B',
  redDark: '#EA2B2B',
  redLight: '#FFF0F0',
  purple: '#CE82FF',
  purpleDark: '#A855D4',
  purpleLight: '#F5EEFF',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  cardRadius: '18px',
  btnRadius: '14px',
};

/* ─── Press button ─── */
const PressButton = ({ children, onClick, variant = 'primary', fullWidth, disabled, style, type = 'button' }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff' },
    blue: { bg: S.blue, shadow: S.blueDark, color: '#fff' },
    ghost: { bg: '#fff', shadow: S.border, color: S.text },
    danger: { bg: S.red, shadow: S.redDark, color: '#fff' },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 52, borderRadius: S.btnRadius,
        background: v.bg, color: v.color,
        border: 'none',
        boxShadow: disabled ? 'none' : `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: fullWidth ? '100%' : undefined,
        transition: 'all .1s',
        letterSpacing: '0.2px',
        WebkitTapHighlightColor: 'transparent',
        ...style,
      }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; } }}
      onMouseUp={e => { if (!disabled) { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; } }}
      onTouchStart={e => { if (!disabled) { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; } }}
      onTouchEnd={e => { if (!disabled) { e.currentTarget.style.boxShadow = `0 4px 0 ${v.shadow}`; e.currentTarget.style.transform = ''; } }}
    >
      {children}
    </button>
  );
};

/* ─── Field label ─── */
const Field = ({ label, required, action, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <label style={{
        fontSize: 13, fontWeight: 800, color: S.textMuted,
        letterSpacing: '0.7px', textTransform: 'uppercase',
      }}>
        {label} {required && <span style={{ color: S.red }}>*</span>}
      </label>
      {action}
    </div>
    {children}
  </div>
);

/* ─── Shared input style ─── */
const inputBase = {
  width: '100%',
  background: S.grayLight,
  border: `2px solid ${S.border}`,
  borderRadius: S.btnRadius,
  padding: '0 16px',
  fontFamily: 'inherit',
  fontSize: 16,
  fontWeight: 700,
  color: S.text,
  outline: 'none',
  transition: 'border-color .2s, background .2s, box-shadow .2s',
  boxSizing: 'border-box',
};

const focusStyle = (e) => {
  e.target.style.borderColor = S.blue;
  e.target.style.background = '#fff';
  e.target.style.boxShadow = `0 0 0 3px ${S.blueLight}`;
};
const blurStyle = (e) => {
  e.target.style.borderColor = S.border;
  e.target.style.background = S.grayLight;
  e.target.style.boxShadow = 'none';
};

/* ─── Auto-fill spinner ─── */
const Spinner = ({ color = S.purple, size = 14 }) => (
  <div style={{
    width: size, height: size,
    borderRadius: '50%',
    border: `2px solid ${color}`,
    borderTopColor: 'transparent',
    animation: 'spin .7s linear infinite',
    flexShrink: 0,
  }} />
);

/* ─── Toast notification ─── */
const Toast = ({ type, message }) => {
  const isSuccess = type === 'success';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 16px',
      borderRadius: S.btnRadius,
      background: isSuccess ? S.greenLight : S.redLight,
      border: `2px solid ${isSuccess ? S.green + '55' : S.red + '55'}`,
      fontSize: 14, fontWeight: 700,
      color: isSuccess ? S.greenDark : S.redDark,
      animation: 'fadeInDown .25s ease',
    }}>
      <span style={{ fontSize: 18, flexShrink: 0 }}>
        {isSuccess ? '✅' : '⚠️'}
      </span>
      {message}
    </div>
  );
};

/* ─── Main page ─── */
const AddWordPage = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [showNewCat, setShowNewCat] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [addedCount, setAddedCount] = useState(0);

  useEffect(() => {
    getCategories().then(setCategories).catch(() => { });
  }, []);

  const handleAutoFill = async () => {
    if (!word.trim()) {
      setError('Vui lòng nhập từ tiếng Anh trước khi tra tự động!');
      return;
    }
    setIsAutoFilling(true);
    setError('');
    try {
      const target = word.trim().toLowerCase();

      /* Translation */
      try {
        const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(target)}&langpair=en|vi`);
        const data = await res.json();
        if (data?.responseData?.translatedText) {
          setMeaning(data.responseData.translatedText.toLowerCase());
        }
      } catch { /* silent */ }

      /* Example */
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(target)}`);
        if (res.ok) {
          const data = await res.json();
          for (const m of data[0]?.meanings || []) {
            for (const d of m.definitions) {
              if (d.example) {
                setExample(d.example.charAt(0).toUpperCase() + d.example.slice(1));
                break;
              }
            }
          }
        }
      } catch { /* silent */ }
    } catch {
      setError('Lỗi khi tra cứu tự động. Vui lòng tự nhập.');
    } finally {
      setIsAutoFilling(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) {
      setError('Vui lòng nhập từ và nghĩa!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addVocabulary({ word: word.trim(), meaning: meaning.trim(), example: example.trim(), category_id: categoryId || null });
      setSuccess(true);
      setAddedCount(c => c + 1);
      setWord(''); setMeaning(''); setExample(''); setCategoryId('');
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setError(err.detail || 'Có lỗi xảy ra khi thêm từ');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCat = async () => {
    if (!newCatName.trim()) return;
    try {
      const created = await createCategory(newCatName.trim());
      setCategories(prev => [...prev, created]);
      setCategoryId(created.id);
      setNewCatName('');
      setShowNewCat(false);
    } catch { /* silent */ }
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: none; }
        }
        input:focus, textarea:focus, select:focus {
          border-color: ${S.blue} !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px ${S.blueLight} !important;
        }
        select option { font-weight: 600; }
      `}</style>

      <div style={{
        width: '100%',
        minHeight: '100%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 20px)',
      }}>

        {/* ── Sticky header ── */}
        <div style={{
          padding: '16px 20px',
          borderBottom: `2px solid ${S.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          position: 'sticky', top: 0,
          background: '#fff', zIndex: 10,
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              width: 36, height: 36,
              borderRadius: 10,
              background: S.grayLight,
              border: `2px solid ${S.border}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: S.textMuted, flexShrink: 0,
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 19, fontWeight: 900, color: S.text, lineHeight: 1.2 }}>Thêm từ mới</h1>
            {addedCount > 0 && (
              <span style={{ fontSize: 12, fontWeight: 700, color: S.green }}>
                +{addedCount} từ đã thêm hôm nay
              </span>
            )}
          </div>
        </div>

        {/* ── Form body ── */}
        <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Tip banner */}
          <div style={{
            background: S.greenLight,
            border: `2px solid ${S.green}33`,
            borderRadius: S.cardRadius,
            padding: '12px 16px',
            display: 'flex', alignItems: 'flex-start', gap: 10,
          }}>
            <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 13, fontWeight: 700, color: S.greenDark, lineHeight: 1.5 }}>
              Thêm câu ví dụ từ YouTube giúp bạn nhớ ngữ cảnh lâu hơn!
            </p>
          </div>

          {/* Toast messages */}
          {error && <Toast type="error" message={error} />}
          {success && <Toast type="success" message="Thêm từ thành công! 🎉" />}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Word field */}
            <Field
              label="Từ tiếng Anh"
              required
              action={
                <button
                  type="button"
                  onClick={handleAutoFill}
                  disabled={isAutoFilling || !word.trim()}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    fontSize: 13, fontWeight: 800,
                    color: S.purple,
                    background: S.purpleLight,
                    border: 'none',
                    borderRadius: 8, padding: '4px 10px',
                    cursor: word.trim() ? 'pointer' : 'default',
                    opacity: word.trim() ? 1 : 0.5,
                    fontFamily: 'inherit',
                    WebkitTapHighlightColor: 'transparent',
                    transition: 'background .15s',
                  }}
                  onMouseEnter={e => { if (word.trim()) e.currentTarget.style.background = '#ead9ff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = S.purpleLight; }}
                >
                  {isAutoFilling ? <Spinner /> : <span>✨</span>}
                  {isAutoFilling ? 'Đang tra...' : 'Tự động tra'}
                </button>
              }
            >
              <input
                type="text"
                value={word}
                onChange={e => { setWord(e.target.value); setError(''); }}
                onFocus={focusStyle} onBlur={blurStyle}
                placeholder="Ví dụ: extraordinary"
                style={{ ...inputBase, height: 52 }}
              />
            </Field>

            {/* Meaning field */}
            <Field label="Nghĩa tiếng Việt" required>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  value={meaning}
                  onChange={e => setMeaning(e.target.value)}
                  onFocus={focusStyle} onBlur={blurStyle}
                  placeholder="Ví dụ: phi thường, đặc biệt"
                  style={{ ...inputBase, height: 52, paddingRight: isAutoFilling ? 44 : 16 }}
                />
                {isAutoFilling && (
                  <div style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                  }}>
                    <Spinner color={S.blue} size={16} />
                  </div>
                )}
              </div>
            </Field>

            {/* Example field */}
            <Field label="Câu ví dụ (tùy chọn)">
              <div style={{ position: 'relative' }}>
                <textarea
                  rows={3}
                  value={example}
                  onChange={e => setExample(e.target.value)}
                  onFocus={focusStyle} onBlur={blurStyle}
                  placeholder="Ví dụ: She is an extraordinary artist."
                  style={{
                    ...inputBase,
                    height: 'auto',
                    padding: '14px 16px',
                    resize: 'none',
                    lineHeight: 1.55,
                    paddingRight: isAutoFilling ? 44 : 16,
                  }}
                />
                {isAutoFilling && (
                  <div style={{
                    position: 'absolute', right: 14, top: 16,
                  }}>
                    <Spinner color={S.blue} size={16} />
                  </div>
                )}
              </div>
            </Field>

            {/* Category field */}
            <Field
              label="Thư mục"
              action={
                <button
                  type="button"
                  onClick={() => setShowNewCat(!showNewCat)}
                  style={{
                    fontSize: 13, fontWeight: 800,
                    color: S.blue,
                    background: 'none', border: 'none',
                    cursor: 'pointer', fontFamily: 'inherit',
                    WebkitTapHighlightColor: 'transparent',
                  }}
                >
                  {showNewCat ? 'Hủy' : '+ Tạo mới'}
                </button>
              }
            >
              {showNewCat ? (
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCat())}
                    onFocus={focusStyle} onBlur={blurStyle}
                    placeholder="Tên thư mục..."
                    style={{ ...inputBase, flex: 1, height: 48 }}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCat}
                    disabled={!newCatName.trim()}
                    style={{
                      height: 48, padding: '0 18px',
                      background: S.blue, color: '#fff',
                      border: 'none', borderRadius: S.btnRadius,
                      fontFamily: 'inherit', fontSize: 14, fontWeight: 800,
                      cursor: newCatName.trim() ? 'pointer' : 'default',
                      opacity: newCatName.trim() ? 1 : 0.5,
                      boxShadow: `0 4px 0 ${S.blueDark}`,
                      flexShrink: 0,
                      WebkitTapHighlightColor: 'transparent',
                    }}
                    onMouseDown={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(4px)'; }}
                    onMouseUp={e => { e.currentTarget.style.boxShadow = `0 4px 0 ${S.blueDark}`; e.currentTarget.style.transform = ''; }}
                  >
                    Lưu
                  </button>
                </div>
              ) : (
                <div style={{ position: 'relative' }}>
                  <select
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    style={{
                      ...inputBase,
                      height: 52,
                      appearance: 'none',
                      WebkitAppearance: 'none',
                      paddingRight: 44,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="">📁 Chưa phân loại</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>📂 {cat.name}</option>
                    ))}
                  </select>
                  {/* Custom arrow */}
                  <div style={{
                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: S.gray,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              )}
            </Field>

            {/* Submit */}
            <div style={{ paddingTop: 4, paddingBottom: 8 }}>
              <PressButton type="submit" variant="primary" fullWidth disabled={loading}>
                {loading ? (
                  <>
                    <Spinner color="#fff" size={16} />
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Lưu từ vựng
                  </>
                )}
              </PressButton>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default AddWordPage;
