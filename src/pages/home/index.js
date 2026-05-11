import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllVocabularies, deleteVocabulary, updateVocabulary } from '../../services/vocabService';
import { playAudio } from '../../utils/speech';
import DuoButton from '../../components/ui/DuoButton';

const HomePage = () => {
  const navigate = useNavigate();
  const [vocabularies, setVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingVocab, setEditingVocab] = useState(null);
  const [deletingVocab, setDeletingVocab] = useState(null); // Trạng thái xóa
  const [editForm, setEditForm] = useState({ word: '', meaning: '', example: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchVocabs();
  }, []);

  const fetchVocabs = async () => {
    try {
      setLoading(true);
      const data = await getAllVocabularies();
      setVocabularies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e, vocab) => {
    e.stopPropagation();
    setDeletingVocab(vocab);
  };

  const confirmDelete = async () => {
    if (!deletingVocab) return;
    try {
      setIsDeleting(true);
      await deleteVocabulary(deletingVocab.id);
      setVocabularies(prev => prev.filter(v => v.id !== deletingVocab.id));
      setDeletingVocab(null);
    } catch (error) {
      alert("Lỗi khi xóa từ vựng!");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openEditModal = (e, vocab) => {
    e.stopPropagation();
    setEditingVocab(vocab);
    setEditForm({ word: vocab.word, meaning: vocab.meaning, example: vocab.example || '' });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editForm.word.trim() || !editForm.meaning.trim()) {
      alert("Vui lòng điền đủ từ và nghĩa.");
      return;
    }

    try {
      setIsSaving(true);
      const updatedVocab = await updateVocabulary(editingVocab.id, editForm);
      setVocabularies(prev => prev.map(v => v.id === updatedVocab.id ? updatedVocab : v));
      setEditingVocab(null);
    } catch (error) {
      alert("Lỗi khi cập nhật từ vựng!");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col min-h-full pb-[40px] bg-[#F7F7F7] relative">
      
      {/* Banner / Vocab Cards */}
      <div className="px-[16px] py-[24px]">
        <div className="flex gap-[12px] overflow-x-auto snap-x hide-scrollbar pb-[8px]">
          
          <div 
            className="min-w-[280px] flex-shrink-0 snap-center bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex flex-col gap-[8px] cursor-pointer hover:border-[#1CB0F6] transition-colors shadow-sm"
            onClick={() => navigate('/practice')}
          >
            <div className="flex items-center justify-between mb-[4px]">
              <div className="w-[40px] h-[40px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center text-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <span className="bg-[#FF9600] text-white text-[12px] font-[800] uppercase px-[8px] py-[2px] rounded-[6px]">Luyện tập</span>
            </div>
            <h3 className="text-[16px] font-bold text-[#4B4B4B]">Ôn tập từ vựng</h3>
            <p className="text-[13px] text-[#AFAFAF] font-[500]">Lật thẻ để đưa từ vựng vào trí nhớ dài hạn.</p>
          </div>

          <div 
            className="min-w-[280px] flex-shrink-0 snap-center bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex flex-col gap-[8px] cursor-pointer hover:border-[#58CC02] transition-colors shadow-sm"
            onClick={() => navigate('/add-word')}
          >
            <div className="flex items-center justify-between mb-[4px]">
              <div className="w-[40px] h-[40px] bg-[#58CC02]/10 text-[#58CC02] rounded-full flex items-center justify-center text-[20px]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </div>
            </div>
            <h3 className="text-[16px] font-bold text-[#4B4B4B]">Thêm từ mới</h3>
            <p className="text-[13px] text-[#AFAFAF] font-[500]">Lưu lại từ vựng bạn vừa gặp trên YouTube.</p>
          </div>

        </div>
      </div>

      {/* Vocabulary List */}
      <div className="flex-1 flex flex-col px-[16px]">
        <h2 className="text-[18px] font-bold text-[#4B4B4B] mb-[16px]">Từ vựng của bạn ({vocabularies.length})</h2>
        
        {loading ? (
          <div className="flex justify-center py-[40px]">
            <div className="animate-spin w-8 h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full"></div>
          </div>
        ) : vocabularies.length === 0 ? (
          <div className="bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[24px] text-center flex flex-col items-center">
            <span className="text-[40px] mb-[12px]">🌱</span>
            <p className="text-[15px] font-[600] text-[#777777] mb-[8px]">Chưa có từ vựng nào</p>
            <p className="text-[13px] text-[#AFAFAF] font-[500]">Hãy bấm nút "Thêm từ mới" để bắt đầu hành trình học nhé!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-[12px]">
            {vocabularies.map((vocab) => (
              <div key={vocab.id} className="bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex flex-col hover:border-[#1CB0F6] transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <h3 className="text-[18px] font-bold text-[#4B4B4B]">{vocab.word}</h3>
                    <button 
                      onClick={(e) => { e.stopPropagation(); playAudio(vocab.word); }}
                      className="w-[32px] h-[32px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-[8px] flex items-center justify-center hover:bg-[#1CB0F6]/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <span className="text-[12px] font-[700] text-[#1CB0F6] bg-[#1CB0F6]/10 px-[8px] py-[4px] rounded-[8px]">
                      Cấp độ {vocab.level}
                    </span>
                    
                    {/* Action Menu (Edit/Delete) */}
                    <div className="flex gap-[4px] ml-[4px]">
                      <button 
                        onClick={(e) => openEditModal(e, vocab)}
                        className="w-[28px] h-[28px] flex items-center justify-center text-[#AFAFAF] hover:text-[#1CB0F6] bg-[#F7F7F7] rounded-[6px] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button 
                        onClick={(e) => handleDeleteClick(e, vocab)}
                        className="w-[28px] h-[28px] flex items-center justify-center text-[#AFAFAF] hover:text-[#FF4B4B] bg-[#F7F7F7] rounded-[6px] transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-[15px] font-[600] text-[#777777] mb-[8px]">{vocab.meaning}</p>
                {vocab.example && (
                  <p className="text-[13px] font-[500] text-[#AFAFAF] italic">"{vocab.example}"</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingVocab && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
          <div className="bg-white rounded-[24px] w-full max-w-[400px] p-[24px] shadow-lg animate-fade-in">
            <div className="flex justify-between items-center mb-[20px]">
              <h2 className="text-[20px] font-bold text-[#4B4B4B]">Sửa từ vựng</h2>
              <button 
                onClick={() => setEditingVocab(null)}
                className="w-[32px] h-[32px] flex items-center justify-center text-[#AFAFAF] hover:text-[#4B4B4B]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="flex flex-col gap-[16px]">
              <div>
                <label className="block text-[14px] font-[700] text-[#777777] mb-[8px] uppercase tracking-wider">Từ tiếng Anh <span className="text-[#FF4B4B]">*</span></label>
                <input 
                  type="text" 
                  required
                  value={editForm.word}
                  onChange={(e) => setEditForm({...editForm, word: e.target.value})}
                  className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] px-[16px] py-[12px] text-[16px] font-[600] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="Ví dụ: Hello"
                />
              </div>

              <div>
                <label className="block text-[14px] font-[700] text-[#777777] mb-[8px] uppercase tracking-wider">Nghĩa tiếng Việt <span className="text-[#FF4B4B]">*</span></label>
                <input 
                  type="text" 
                  required
                  value={editForm.meaning}
                  onChange={(e) => setEditForm({...editForm, meaning: e.target.value})}
                  className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] px-[16px] py-[12px] text-[16px] font-[600] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors"
                  placeholder="Ví dụ: Xin chào"
                />
              </div>

              <div>
                <label className="block text-[14px] font-[700] text-[#777777] mb-[8px] uppercase tracking-wider">Câu ví dụ (Không bắt buộc)</label>
                <textarea 
                  rows="3"
                  value={editForm.example}
                  onChange={(e) => setEditForm({...editForm, example: e.target.value})}
                  className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] px-[16px] py-[12px] text-[16px] font-[500] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-colors resize-none"
                  placeholder="Ví dụ: Hello, how are you?"
                />
              </div>

              <DuoButton 
                type="submit" 
                variant="primary" 
                className="w-full mt-[8px]"
                disabled={isSaving}
              >
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </DuoButton>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingVocab && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-[16px]">
          <div className="bg-white rounded-[24px] w-full max-w-[340px] p-[24px] shadow-lg animate-fade-in text-center flex flex-col items-center">
            <div className="w-[64px] h-[64px] bg-[#FF4B4B]/10 text-[#FF4B4B] rounded-full flex items-center justify-center mb-[16px]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            </div>
            
            <h2 className="text-[20px] font-bold text-[#4B4B4B] mb-[8px]">Xóa từ vựng này?</h2>
            <p className="text-[15px] font-[500] text-[#777777] mb-[24px]">
              Bạn đang xóa từ <span className="font-bold text-[#4B4B4B]">"{deletingVocab.word}"</span>. Mọi quá trình học của từ này sẽ bị mất vĩnh viễn.
            </p>
            
            <div className="flex flex-col gap-[12px] w-full">
              <DuoButton 
                variant="danger" 
                className="w-full"
                onClick={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Đang xóa...' : 'Xóa luôn'}
              </DuoButton>
              <DuoButton 
                variant="ghost" 
                className="w-full border-2 border-[#E5E5E5]"
                onClick={() => setDeletingVocab(null)}
                disabled={isDeleting}
              >
                Giữ lại
              </DuoButton>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;
