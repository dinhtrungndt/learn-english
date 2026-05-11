import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { addVocabulary } from '../../services/vocabService';

const AddWordPage = () => {
  const navigate = useNavigate();
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word || !meaning) {
      setError('Vui lòng nhập từ và nghĩa!');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      await addVocabulary({ word, meaning, example });
      setSuccess(true);
      // Reset form
      setWord('');
      setMeaning('');
      setExample('');
      
      // Tự động tắt thông báo thành công sau 2s
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.detail || 'Có lỗi xảy ra khi thêm từ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-full">
      <div className="p-[16px] flex-1 flex flex-col">
        <h1 className="text-[20px] font-bold text-[#4B4B4B] mb-[16px]">Thêm từ mới</h1>
        <div className="bg-[#58CC02]/10 border-2 border-[#58CC02]/20 rounded-[16px] p-[16px] mb-[24px]">
          <p className="text-[#58CC02] font-[600] text-[14px]">
            💡 Gợi ý: Thêm câu ví dụ mà bạn nghe được trên YouTube để nhớ ngữ cảnh lâu hơn nhé!
          </p>
        </div>

        {error && (
          <div className="bg-[#FF4B4B]/10 text-[#FF4B4B] p-[12px] rounded-[12px] mb-[16px] font-[600] text-[14px]">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-[#58CC02]/10 text-[#58CC02] p-[12px] rounded-[12px] mb-[16px] font-[600] text-[14px] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            Thêm từ thành công!
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px] flex-1">
          <div className="flex flex-col gap-[8px]">
            <label className="text-[15px] font-[700] text-[#4B4B4B]">Từ tiếng Anh <span className="text-[#FF4B4B]">*</span></label>
            <input 
              type="text" 
              className="h-[48px] bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] px-[16px] text-[16px] font-[500] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
              placeholder="Ví dụ: extraordinary"
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[15px] font-[700] text-[#4B4B4B]">Nghĩa tiếng Việt <span className="text-[#FF4B4B]">*</span></label>
            <input 
              type="text" 
              className="h-[48px] bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] px-[16px] text-[16px] font-[500] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-all"
              placeholder="Ví dụ: phi thường, đặc biệt"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-[8px]">
            <label className="text-[15px] font-[700] text-[#4B4B4B]">Câu ví dụ (Tùy chọn)</label>
            <textarea 
              className="h-[100px] bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] p-[16px] text-[16px] font-[500] text-[#4B4B4B] outline-none focus:border-[#1CB0F6] focus:bg-white transition-all resize-none"
              placeholder="Ví dụ: She is an extraordinary artist."
              value={example}
              onChange={(e) => setExample(e.target.value)}
            />
          </div>

          <div className="mt-auto pt-[24px]">
            <DuoButton 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : 'Lưu từ vựng'}
            </DuoButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWordPage;
