import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCategory, deleteCategory, getCategories } from '../../services/categoryService';
import { deleteVocabulary, getAllVocabularies, updateVocabulary } from '../../services/vocabService';
import { playAudio } from '../../utils/speech';

/* ─────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────── */
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
  purpleLight: '#F5EEFF',
  orange: '#FF9600',
  gray: '#AFAFAF',
  grayLight: '#F7F7F7',
  border: '#E8E8E8',
  text: '#3C3C3C',
  textMuted: '#8A8A8A',
  cardRadius: '18px',
  btnRadius: '14px',
  /* Footer height + safe area */
  footerH: 'calc(64px + env(safe-area-inset-bottom, 0px))',
};

/* ─────────────────────────────────────────
   SHARED SMALL COMPONENTS
───────────────────────────────────────── */

const PressButton = ({ children, onClick, variant = 'primary', fullWidth, disabled, style, type = 'button' }) => {
  const variants = {
    primary: { bg: S.green, shadow: S.greenDark, color: '#fff', border: 'none' },
    danger: { bg: S.red, shadow: S.redDark, color: '#fff', border: 'none' },
    ghost: { bg: '#fff', shadow: S.border, color: S.text, border: `2px solid ${S.border}` },
    blue: { bg: S.blue, shadow: S.blueDark, color: '#fff', border: 'none' },
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
        border: v.border, boxShadow: `0 4px 0 ${v.shadow}`,
        fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        width: fullWidth ? '100%' : undefined,
        transition: 'all .1s',
        letterSpacing: '0.2px',
        ...style,
      }}
      onMouseDown={e => { if (!disabled) e.currentTarget.style.cssText += ';box-shadow:none;transform:translateY(4px)'; }}
      onMouseUp={e => { e.currentTarget.style.cssText = e.currentTarget.style.cssText.replace(';box-shadow:none;transform:translateY(4px)', ''); }}
    >
      {children}
    </button>
  );
};

const SpeakerBtn = ({ word, onClick }) => (
  <button
    onClick={e => { e.stopPropagation(); onClick ? onClick() : playAudio(word); }}
    style={{
      width: 30, height: 30, borderRadius: 8,
      background: S.blueLight, border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0,
    }}
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill={S.blue} stroke={S.blue} strokeWidth="1.5">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" fill="none" strokeLinecap="round" />
    </svg>
  </button>
);

const IconBtn = ({ type, onClick }) => {
  const isEdit = type === 'edit';
  return (
    <button
      onClick={onClick}
      style={{
        width: 30, height: 30, borderRadius: 8,
        background: S.grayLight, border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: S.gray,
        transition: 'all .15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = isEdit ? S.blue : S.red;
        e.currentTarget.style.background = isEdit ? S.blueLight : S.redLight;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = S.gray;
        e.currentTarget.style.background = S.grayLight;
      }}
    >
      {isEdit ? (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      ) : (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
      )}
    </button>
  );
};

const CloseBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: 32, height: 32, borderRadius: '50%',
      background: S.grayLight, border: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', color: S.textMuted, flexShrink: 0,
    }}
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  </button>
);

const Field = ({ label, required, children }) => (
  <div>
    <label style={{ display: 'block', fontSize: 12, fontWeight: 800, color: S.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8 }}>
      {label} {required && <span style={{ color: S.red }}>*</span>}
    </label>
    {children}
  </div>
);

const inputStyle = {
  width: '100%', height: 52,
  background: S.grayLight, border: `2px solid ${S.border}`,
  borderRadius: S.btnRadius, padding: '0 16px',
  fontFamily: 'inherit', fontSize: 16, fontWeight: 700,
  color: S.text, outline: 'none', transition: 'all .2s',
  boxSizing: 'border-box',
};

/* ─────────────────────────────────────────
   MODAL OVERLAY WRAPPER
───────────────────────────────────────── */
const Overlay = ({ onClose, children }) => (
  <div
    onClick={onClose}
    style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,.5)',
      zIndex: 200,
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}
  >
    <div
      onClick={e => e.stopPropagation()}
      style={{
        background: '#fff',
        borderRadius: '24px 24px 0 0',
        width: '100%',
        maxWidth: 480,
        padding: '8px 0 0',
        /* Account for phone safe area at bottom */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideUp .25s ease',
      }}
    >
      <div style={{ width: 40, height: 4, borderRadius: 99, background: S.border, margin: '8px auto 16px' }} />
      {children}
    </div>
  </div>
);

/* ─────────────────────────────────────────
   EDIT MODAL
───────────────────────────────────────── */
const EditModal = ({ vocab, onClose, onSave }) => {
  const [form, setForm] = useState({ word: vocab.word, meaning: vocab.meaning, example: vocab.example || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.word.trim() || !form.meaning.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const focused = (e) => { e.target.style.borderColor = S.blue; e.target.style.background = '#fff'; };
  const blurred = (e) => { e.target.style.borderColor = S.border; e.target.style.background = S.grayLight; };

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: '0 20px', overflowY: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: S.text }}>✏️ Sửa từ vựng</h2>
          <CloseBtn onClick={onClose} />
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 32 }}>
          <Field label="Từ tiếng Anh" required>
            <input type="text" required value={form.word}
              onChange={e => setForm({ ...form, word: e.target.value })}
              onFocus={focused} onBlur={blurred}
              placeholder="Ví dụ: resilient" style={inputStyle} />
          </Field>

          <Field label="Nghĩa tiếng Việt" required>
            <input type="text" required value={form.meaning}
              onChange={e => setForm({ ...form, meaning: e.target.value })}
              onFocus={focused} onBlur={blurred}
              placeholder="Ví dụ: kiên cường" style={inputStyle} />
          </Field>

          <Field label="Câu ví dụ (không bắt buộc)">
            <textarea rows={3} value={form.example}
              onChange={e => setForm({ ...form, example: e.target.value })}
              onFocus={focused} onBlur={blurred}
              placeholder="Ví dụ: She is resilient in difficult times."
              style={{ ...inputStyle, height: 'auto', padding: '14px 16px', resize: 'none', lineHeight: 1.5 }} />
          </Field>

          <PressButton type="submit" variant="primary" fullWidth disabled={saving}>
            {saving ? '⏳ Đang lưu...' : '✅ Lưu thay đổi'}
          </PressButton>
        </form>
      </div>
    </Overlay>
  );
};

/* ─────────────────────────────────────────
   DELETE CONFIRM MODAL
───────────────────────────────────────── */
const DeleteModal = ({ vocab, onClose, onConfirm, isDeleting }) => (
  <Overlay onClose={onClose}>
    <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: S.redLight, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, marginBottom: 16,
      }}>🗑️</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: S.text, marginBottom: 8 }}>Xóa từ này?</h2>
      <p style={{ fontSize: 15, color: S.textMuted, fontWeight: 600, lineHeight: 1.6, marginBottom: 28 }}>
        Bạn đang xóa từ{' '}
        <strong style={{ color: S.text }}>"{vocab.word}"</strong>.{' '}
        Tiến trình học của từ này sẽ mất vĩnh viễn.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        <PressButton variant="danger" fullWidth onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? '⏳ Đang xóa...' : '🗑️ Xóa luôn'}
        </PressButton>
        <PressButton variant="ghost" fullWidth onClick={onClose} disabled={isDeleting}>
          Giữ lại
        </PressButton>
      </div>
    </div>
  </Overlay>
);

/* ─────────────────────────────────────────
   MANAGE CATEGORIES MODAL
───────────────────────────────────────── */
const CategoriesModal = ({ categories, onClose, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    await onAdd(name.trim());
    setName('');
    setAdding(false);
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: '0 20px', flex: 1, display: 'flex', flexDirection: 'column', maxHeight: '75vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: S.text }}>📂 Thư mục</h2>
          <CloseBtn onClick={onClose} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input
            type="text"
            placeholder="Tên thư mục mới..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            style={{
              flex: 1, height: 46,
              background: S.grayLight, border: `2px solid ${S.border}`,
              borderRadius: S.btnRadius, padding: '0 14px',
              fontFamily: 'inherit', fontSize: 15, fontWeight: 700,
              color: S.text, outline: 'none', boxSizing: 'border-box',
            }}
          />
          <button
            onClick={handleAdd}
            disabled={adding || !name.trim()}
            style={{
              width: 46, height: 46, borderRadius: S.btnRadius,
              background: S.blue, border: 'none',
              color: '#fff', fontSize: 22, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: name.trim() ? 'pointer' : 'default',
              opacity: name.trim() ? 1 : 0.4,
              boxShadow: `0 4px 0 ${S.blueDark}`,
              flexShrink: 0,
            }}
          >+</button>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: 24 }}>
          {categories.length === 0 ? (
            <p style={{ textAlign: 'center', color: S.gray, fontWeight: 700, padding: '24px 0' }}>
              Chưa có thư mục nào
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {categories.map(cat => (
                <div key={cat.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', background: S.grayLight,
                  borderRadius: S.btnRadius,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>📂</span>
                    <span style={{ fontSize: 15, fontWeight: 800, color: S.text }}>{cat.name}</span>
                  </div>
                  <button
                    onClick={() => onDelete(cat.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: S.gray, padding: 4 }}
                    onMouseEnter={e => e.currentTarget.style.color = S.red}
                    onMouseLeave={e => e.currentTarget.style.color = S.gray}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Overlay>
  );
};

/* ─────────────────────────────────────────
   ACTION CARD
───────────────────────────────────────── */
const ActionCard = ({ icon, badge, badgeColor, title, subtitle, accentColor, onClick }) => (
  <div
    onClick={onClick}
    style={{
      minWidth: 150, flexShrink: 0,
      background: '#fff', border: `2px solid ${S.border}`,
      borderRadius: S.cardRadius, padding: '14px',
      display: 'flex', flexDirection: 'column', gap: 8,
      cursor: 'pointer', transition: 'border-color .15s, transform .1s',
      /* Prevent tap highlight on mobile */
      WebkitTapHighlightColor: 'transparent',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor || S.blue; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.transform = 'none'; }}
  >
    <div style={{
      width: 40, height: 40, borderRadius: 12,
      background: `${accentColor}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20,
    }}>{icon}</div>
    {badge && (
      <span style={{
        display: 'inline-block', fontSize: 11, fontWeight: 800,
        padding: '3px 8px', borderRadius: 6, alignSelf: 'flex-start',
        background: `${badgeColor}22`, color: badgeColor,
      }}>{badge}</span>
    )}
    <div style={{ fontSize: 14, fontWeight: 900, color: S.text, lineHeight: 1.25 }}>{title}</div>
    <div style={{ fontSize: 12, fontWeight: 600, color: S.gray, lineHeight: 1.4 }}>{subtitle}</div>
  </div>
);

/* ─────────────────────────────────────────
   VOCABULARY CARD
───────────────────────────────────────── */
const VocabCard = ({ vocab, onEdit, onDelete }) => (
  <div style={{
    background: '#fff', border: `2px solid ${S.border}`,
    borderRadius: S.cardRadius, padding: '14px 16px',
    transition: 'border-color .15s',
    WebkitTapHighlightColor: 'transparent',
  }}
    onMouseEnter={e => e.currentTarget.style.borderColor = S.blue}
    onMouseLeave={e => e.currentTarget.style.borderColor = S.border}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: S.text }}>{vocab.word}</span>
        <SpeakerBtn word={vocab.word} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{
          fontSize: 12, fontWeight: 800,
          color: S.blue, background: S.blueLight,
          padding: '3px 8px', borderRadius: 6,
        }}>Cấp {vocab.level}</span>
        <IconBtn type="edit" onClick={e => { e.stopPropagation(); onEdit(); }} />
        <IconBtn type="delete" onClick={e => { e.stopPropagation(); onDelete(); }} />
      </div>
    </div>

    <div style={{ fontSize: 14, fontWeight: 700, color: S.textMuted, marginBottom: vocab.example ? 4 : 0 }}>
      {vocab.meaning}
    </div>

    {vocab.example && (
      <div style={{ fontSize: 12, fontWeight: 600, color: S.gray, fontStyle: 'italic' }}>
        "{vocab.example}"
      </div>
    )}
  </div>
);

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [editingVocab, setEditingVocab] = useState(null);
  const [deletingVocab, setDeletingVocab] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    fetchVocabs();
    getCategories().then(setCategories).catch(() => { });
  }, []);

  const fetchVocabs = async () => {
    try {
      setLoading(true);
      setVocabularies(await getAllVocabularies());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    try {
      const updated = await updateVocabulary(editingVocab.id, form);
      setVocabularies(prev => prev.map(v => v.id === updated.id ? updated : v));
      setEditingVocab(null);
    } catch { alert('Lỗi khi cập nhật từ vựng!'); }
  };

  const handleConfirmDelete = async () => {
    if (!deletingVocab) return;
    try {
      setIsDeleting(true);
      await deleteVocabulary(deletingVocab.id);
      setVocabularies(prev => prev.filter(v => v.id !== deletingVocab.id));
      setDeletingVocab(null);
    } catch { alert('Lỗi khi xóa từ vựng!'); }
    finally { setIsDeleting(false); }
  };

  const handleAddCategory = async (name) => {
    try {
      const cat = await createCategory(name);
      setCategories(prev => [...prev, cat]);
    } catch { alert('Lỗi khi thêm thư mục!'); }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Xóa thư mục này? Các từ vựng sẽ không bị xóa.')) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (activeCategory === id) setActiveCategory('all');
      fetchVocabs();
    } catch { alert('Lỗi khi xóa thư mục!'); }
  };

  const filteredVocabs = activeCategory === 'all'
    ? vocabularies
    : vocabularies.filter(v => v.category_id?.toLowerCase() === activeCategory?.toLowerCase());

  const activeCatName = categories.find(c => c.id === activeCategory)?.name || 'Thư mục';

  return (
    <>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(60px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus {
          border-color: ${S.blue} !important;
          background: #fff !important;
          box-shadow: 0 0 0 3px ${S.blueLight} !important;
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>

      {/*
        ── SCROLLABLE CONTENT AREA ──
        Ocupa el espacio entre el header y el footer fijo.
        padding-bottom = altura del footer + FAB strip (≈52px) + espacio extra
      */}
      <div style={{
        width: '100%',
        background: S.grayLight,
        /* El footer tiene 64px + safe-area. Los FABs suman ~76px más.
           Usamos un padding generoso para que el último card no quede tapado. */
        paddingBottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 88px)',
        minHeight: '100%',
      }}>

        {/* ── Action cards ── */}
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: S.gray, letterSpacing: '0.8px', textTransform: 'uppercase', padding: '0 20px', marginBottom: 12 }}>
            Hành động nhanh
          </div>
          <div className="hide-scrollbar" style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '0 20px 20px' }}>
            <ActionCard
              icon="🔥" badge="Luyện tập" badgeColor={S.orange}
              title="Ôn tập từ vựng" subtitle="Lật thẻ ghi nhớ dài hạn"
              accentColor={S.orange}
              onClick={() => navigate(`/practice${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`)}
            />
            <ActionCard
              icon="➕"
              title="Thêm từ mới" subtitle="Lưu từ vừa gặp trên YouTube"
              accentColor={S.green}
              onClick={() => navigate('/add-word')}
            />
            <ActionCard
              icon="📝" badge="Kiểm tra" badgeColor={S.purple}
              title="Làm bài kiểm tra" subtitle="Đánh giá năng lực hiện tại"
              accentColor={S.purple}
              onClick={() => navigate(`/test${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`)}
            />
          </div>
        </div>

        {/* ── Category filter ── */}
        <div className="hide-scrollbar" style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', padding: '0 20px 14px' }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: 99,
              fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
              border: `2px solid ${activeCategory === 'all' ? S.blue : S.border}`,
              background: activeCategory === 'all' ? S.blue : '#fff',
              color: activeCategory === 'all' ? '#fff' : S.textMuted,
              cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
            }}
          >📁 Tất cả</button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 99,
                fontSize: 13, fontWeight: 800, fontFamily: 'inherit',
                border: `2px solid ${activeCategory === cat.id ? S.blue : S.border}`,
                background: activeCategory === cat.id ? S.blue : '#fff',
                color: activeCategory === cat.id ? '#fff' : S.textMuted,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .15s',
              }}
            >📂 {cat.name}</button>
          ))}

          <button
            onClick={() => setShowCategories(true)}
            style={{
              width: 34, height: 34, flexShrink: 0, marginLeft: 'auto',
              background: '#fff', border: `2px solid ${S.border}`,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: S.gray, transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = S.blue; e.currentTarget.style.color = S.blue; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = S.border; e.currentTarget.style.color = S.gray; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* ── Section header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px 14px' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: S.text }}>
            {activeCategory === 'all' ? 'Từ vựng của bạn' : activeCatName}
          </h2>
          <span style={{ fontSize: 13, fontWeight: 700, color: S.gray }}>
            {filteredVocabs.length} từ
          </span>
        </div>

        {/* ── Vocab list ── */}
        <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: `4px solid ${S.blue}`, borderTopColor: 'transparent',
                animation: 'spin 1s linear infinite',
              }} />
            </div>
          ) : filteredVocabs.length === 0 ? (
            <div style={{
              background: '#fff', border: `2px solid ${S.border}`,
              borderRadius: S.cardRadius, padding: 24,
              textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: 40, marginBottom: 12 }}>🌱</span>
              <p style={{ fontSize: 15, fontWeight: 700, color: S.textMuted, marginBottom: 6 }}>Chưa có từ vựng nào</p>
              <p style={{ fontSize: 13, color: S.gray, fontWeight: 600 }}>
                {activeCategory === 'all'
                  ? 'Bấm "Thêm từ mới" để bắt đầu hành trình học nhé!'
                  : 'Thư mục này chưa có từ nào.'}
              </p>
            </div>
          ) : (
            filteredVocabs.map(vocab => (
              <VocabCard
                key={vocab.id}
                vocab={vocab}
                onEdit={() => setEditingVocab(vocab)}
                onDelete={() => setDeletingVocab(vocab)}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Floating Action Buttons ──
          Sits ABOVE the fixed footer (z-index 40 < 100 of footer, but positioned
          with bottom = footer height so it clears the footer visually) */}
      <div style={{
        position: 'fixed',
        bottom: 'calc(64px + env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        padding: '12px 20px',
        background: 'linear-gradient(to top, rgba(247,247,247,0.98) 60%, rgba(247,247,247,0))',
        display: 'flex',
        gap: 10,
        zIndex: 90,
        pointerEvents: 'none', /* let clicks pass through gradient to cards */
      }}>
        <PressButton
          variant="primary"
          style={{ flex: 1, pointerEvents: 'all' }}
          onClick={() => navigate(`/practice${activeCategory !== 'all' ? `?category=${activeCategory}` : ''}`)}
        >
          🔥 Ôn tập ngay
        </PressButton>
        <PressButton
          variant="ghost"
          style={{ flex: 1, pointerEvents: 'all' }}
          onClick={() => navigate('/add-word')}
        >
          + Thêm từ
        </PressButton>
      </div>

      {/* ── Modals ── */}
      {editingVocab && (
        <EditModal vocab={editingVocab} onClose={() => setEditingVocab(null)} onSave={handleSave} />
      )}
      {deletingVocab && (
        <DeleteModal vocab={deletingVocab} onClose={() => setDeletingVocab(null)} onConfirm={handleConfirmDelete} isDeleting={isDeleting} />
      )}
      {showCategories && (
        <CategoriesModal categories={categories} onClose={() => setShowCategories(false)} onAdd={handleAddCategory} onDelete={handleDeleteCategory} />
      )}
    </>
  );
};

export default HomePage;
