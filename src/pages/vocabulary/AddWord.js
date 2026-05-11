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
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAutoFill = async () => {
    if (!word.trim()) {
      setError('Vui lòng nhập từ tiếng Anh trước khi tra tự động!');
      return;
    }

    setIsAutoFilling(true);
    setError('');
    
    try {
      const targetWord = word.trim().toLowerCase();
      
      // 1. Fetch Vietnamese Meaning (MyMemory)
      let translatedMeaning = '';
      try {
        const translateRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(targetWord)}&langpair=en|vi`);
        const translateData = await translateRes.json();
        if (translateData && translateData.responseData && translateData.responseData.translatedText) {
          translatedMeaning = translateData.responseData.translatedText.toLowerCase();
          setMeaning(translatedMeaning);
        }
      } catch (err) {
        console.error("Translate API Error:", err);
      }

      // 2. Fetch English Example (Free Dictionary API)
      try {
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(targetWord)}`);
        if (dictRes.ok) {
          const dictData = await dictRes.json();
          // Find the first definition that has an example
          let foundExample = '';
          const meanings = dictData[0]?.meanings || [];
          for (let m of meanings) {
            for (let d of m.definitions) {
              if (d.example) {
                foundExample = d.example;
                break;
              }
            }
            if (foundExample) break;
          }
          if (foundExample) {
            // Capitalize first letter
            setExample(foundExample.charAt(0).toUpperCase() + foundExample.slice(1));
          }
        }
      } catch (err) {
        console.error("Dictionary API Error:", err);
      }

    } catch (err) {
      setError('Lỗi khi tra cứu tự động. Vui lòng tự nhập.');
    } finally {
      setIsAutoFilling(false);
    }
  };

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
            <div className="flex items-center justify-between">
              <label className="text-[15px] font-[700] text-[#4B4B4B]">Từ tiếng Anh <span className="text-[#FF4B4B]">*</span></label>
              <button 
                type="button" 
                onClick={handleAutoFill}
                disabled={isAutoFilling || !word.trim()}
                className="flex items-center gap-[6px] text-[13px] font-[700] text-[#CE82FF] bg-[#CE82FF]/10 px-[10px] py-[4px] rounded-[8px] hover:bg-[#CE82FF]/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAutoFilling ? (
                  <div className="w-[14px] h-[14px] border-2 border-[#CE82FF] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>✨</span>
                )}
                Tự động tra
              </button>
            </div>
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
