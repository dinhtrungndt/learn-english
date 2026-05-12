import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { getAllVocabularies } from '../../services/vocabService';
import { playAudio } from '../../utils/speech';

const TestPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get('category');
  
  // Data
  const [allVocabs, setAllVocabs] = useState([]); // Tất cả từ trong danh mục
  
  // Game Engine State
  const [exercises, setExercises] = useState([]); // Hàng đợi các câu hỏi
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [mistakesList, setMistakesList] = useState([]); // Lưu thông tin các từ làm sai
  const [isCompleted, setIsCompleted] = useState(false);
  
  // UI State
  const [loading, setLoading] = useState(true);
  
  // Current Exercise State
  const [options, setOptions] = useState([]);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      let data = await getAllVocabularies();
      
      if (categoryId) {
        data = data.filter(v => v.category_id?.toLowerCase() === categoryId.toLowerCase());
      }

      setAllVocabs(data);
      
      if (data.length >= 4) {
        startTest(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const startTest = (data) => {
    setScore(0);
    setMistakesList([]);
    setIsCompleted(false);
    setCurrentIndex(0);

    // Chọn tối đa 15 từ ngẫu nhiên để làm bài test
    const testVocabs = [...data].sort(() => 0.5 - Math.random()).slice(0, 15);
    
    let newExercises = [];
    testVocabs.forEach(vocab => {
      // Mỗi từ tạo 1 loại câu hỏi ngẫu nhiên
      const types = ['quiz_en_to_vi', 'quiz_vi_to_en', 'quiz_listen', 'type_word'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      newExercises.push({ type: randomType, vocab });
    });

    // Trộn ngẫu nhiên câu hỏi
    newExercises = newExercises.sort(() => Math.random() - 0.5);
    setExercises(newExercises);
    setupExercise(0, newExercises, data);
  };

  const setupExercise = (index, exs = exercises, all = allVocabs) => {
    const ex = exs[index];
    if (!ex) return;

    setTypedAnswer('');
    setFeedback(null);
    setSelectedOption(null);

    if (ex.type === 'quiz_en_to_vi' || ex.type === 'quiz_vi_to_en' || ex.type === 'quiz_listen') {
      let distractors = all.filter(v => v.id !== ex.vocab.id);
      distractors = distractors.sort(() => 0.5 - Math.random()).slice(0, 3);
      const mixedOptions = [ex.vocab, ...distractors].sort(() => 0.5 - Math.random());
      setOptions(mixedOptions);

      if (ex.type === 'quiz_listen') {
        setTimeout(() => playAudio(ex.vocab.word), 500);
      }
    }
  };

  const submitAnswer = (isCorrect) => {
    const currentExercise = exercises[currentIndex];
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      playAudio('Correct', 'normal', 'en-US'); // Hiệu ứng âm thanh đúng
      setScore(prev => prev + 1);
    } else {
      playAudio('Incorrect', 'normal', 'en-US'); // Hiệu ứng sai
      setMistakesList(prev => [...prev, currentExercise.vocab]);
    }

    // Chuyển câu sau khi cho người dùng xem đáp án
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      if (nextIndex < exercises.length) {
        setCurrentIndex(nextIndex);
        setupExercise(nextIndex, exercises, allVocabs);
      } else {
        setIsCompleted(true);
      }
    }, isCorrect ? 1000 : 2500);
  };

  const checkQuizAnswer = (option) => {
    if (feedback) return;
    setSelectedOption(option.id);
    const currentExercise = exercises[currentIndex];
    const isCorrect = option.id === currentExercise.vocab.id;
    submitAnswer(isCorrect);
  };

  const checkTypingAnswer = (e) => {
    e.preventDefault();
    if (feedback) return;
    const currentExercise = exercises[currentIndex];
    const isCorrect = typedAnswer.trim().toLowerCase() === currentExercise.vocab.word.toLowerCase();
    submitAnswer(isCorrect);
  };

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[500px]">
        <div className="animate-spin w-8 h-8 border-4 border-[#CE82FF] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (allVocabs.length < 4) {
    return (
      <div className="w-full flex flex-col bg-white min-h-full">
        <div className="flex items-center justify-between px-[16px] py-[16px] border-b-2 border-[#E5E5E5] sticky top-0 bg-white z-10">
          <h1 className="text-[20px] font-bold text-[#4B4B4B]">Kiểm tra</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-[24px] text-center">
          <div className="w-[120px] h-[120px] bg-[#F7F7F7] rounded-full flex items-center justify-center text-[48px] border-4 border-[#E5E5E5] mb-[24px]">⚠️</div>
          <h2 className="text-[20px] font-bold text-[#4B4B4B] mb-[8px]">Chưa đủ từ vựng</h2>
          <p className="text-[15px] text-[#AFAFAF] mb-[32px] font-[500]">
            Cần ít nhất 4 từ vựng trong thư mục này để có thể tạo bài kiểm tra trắc nghiệm. Hãy thêm từ mới nhé!
          </p>
          <DuoButton onClick={() => navigate('/add-word')} className="w-full mb-[16px]">
            Thêm từ mới ngay
          </DuoButton>
          <DuoButton variant="ghost" onClick={() => navigate('/')} className="w-full">
            Về Trang Chủ
          </DuoButton>
        </div>
      </div>
    );
  }

  // Màn hình hoàn thành
  if (isCompleted) {
    const isPerfect = score === exercises.length;
    const percentage = Math.round((score / exercises.length) * 100);

    return (
      <div className="w-full flex flex-col bg-white min-h-full">
        <div className="flex-1 overflow-y-auto px-[24px] py-[40px] flex flex-col items-center">
          <div className="text-[80px] mb-[16px]">
            {isPerfect ? '🏆' : percentage >= 80 ? '🌟' : percentage >= 50 ? '👍' : '💪'}
          </div>
          <h2 className="text-[28px] font-bold text-[#4B4B4B] mb-[8px]">
            {isPerfect ? 'Xuất sắc!' : percentage >= 80 ? 'Rất tốt!' : percentage >= 50 ? 'Khá ổn!' : 'Cố gắng lên!'}
          </h2>
          
          <div className="bg-[#CE82FF]/10 w-full rounded-[24px] p-[24px] mb-[32px] border-2 border-[#CE82FF]/30 flex flex-col items-center">
            <span className="text-[14px] font-[700] text-[#CE82FF] uppercase mb-[8px]">Điểm số của bạn</span>
            <span className="text-[48px] font-[900] text-[#CE82FF]">{score} <span className="text-[24px] text-[#CE82FF]/50">/ {exercises.length}</span></span>
          </div>

          {mistakesList.length > 0 && (
            <div className="w-full mb-[32px]">
              <h3 className="text-[18px] font-bold text-[#4B4B4B] mb-[16px]">Những từ cần chú ý:</h3>
              <div className="flex flex-col gap-[12px]">
                {Array.from(new Set(mistakesList.map(v => v.id))).map(id => {
                  const vocab = mistakesList.find(v => v.id === id);
                  return (
                    <div key={id} className="bg-white border-2 border-[#E5E5E5] rounded-[16px] p-[16px] flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[16px] font-[800] text-[#4B4B4B]">{vocab.word}</span>
                        <span className="text-[14px] font-[500] text-[#AFAFAF]">{vocab.meaning}</span>
                      </div>
                      <button onClick={() => playAudio(vocab.word)} className="w-[32px] h-[32px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-[12px] w-full mt-auto">
            <DuoButton 
              variant="primary" 
              onClick={() => startTest(allVocabs)}
              className="w-full !bg-[#CE82FF] !border-[#CE82FF] shadow-[0_4px_0_0_#A855F7] active:shadow-none"
            >
              Kiểm tra lại
            </DuoButton>
            <DuoButton 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="w-full border-2 border-[#E5E5E5]"
            >
              Về Trang Chủ
            </DuoButton>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  if (!currentExercise) return null;
  
  const currentVocab = currentExercise.vocab;
  const progress = ((currentIndex) / exercises.length) * 100;

  const renderSpeakerButtons = (word) => (
    <div className="flex items-center justify-center gap-[12px] z-20">
      <button onClick={(e) => { e.stopPropagation(); playAudio(word, 'normal'); }} className="w-[56px] h-[56px] bg-[#1CB0F6] text-white rounded-full flex items-center justify-center shadow-[0_4px_0_#1899D6] active:shadow-[0_0_0_#1899D6] active:translate-y-[4px] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); playAudio(word, 'slow'); }} className="w-[40px] h-[40px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center font-bold text-[14px] hover:bg-[#1CB0F6]/20 transition-colors">
        0.5x
      </button>
    </div>
  );

  const renderGame = () => {
    switch (currentExercise.type) {
      case 'quiz_en_to_vi':
        return (
          <div className={`flex flex-col items-center justify-center w-full h-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[12px]">Chọn nghĩa Tiếng Việt</h2>
            <div className="flex flex-col items-center gap-[16px] mb-[40px]">
              <h1 className="text-[36px] font-[800] text-[#4B4B4B]">{currentVocab.word}</h1>
              {renderSpeakerButtons(currentVocab.word)}
            </div>
            <div className="w-full flex flex-col gap-[12px]">
              {options.map((opt) => {
                let btnClass = "w-full text-left justify-start h-auto min-h-[56px] py-[12px] px-[20px]";
                if (feedback) {
                  if (opt.id === currentVocab.id) btnClass += " !bg-[#58CC02] !border-[#46A302] !text-white";
                  else if (opt.id === selectedOption) btnClass += " !bg-[#FF4B4B] !border-[#EA2B2B] !text-white";
                  else btnClass += " opacity-50";
                }
                return (
                  <DuoButton key={opt.id} variant={selectedOption === opt.id ? "primary" : "ghost"} className={btnClass} onClick={() => checkQuizAnswer(opt)} disabled={!!feedback}>
                    <span className="text-[16px]">{opt.meaning}</span>
                  </DuoButton>
                );
              })}
            </div>
          </div>
        );

      case 'quiz_vi_to_en':
        return (
          <div className={`flex flex-col items-center justify-center w-full h-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[12px]">Chọn từ Tiếng Anh</h2>
            <div className="flex flex-col items-center gap-[16px] mb-[40px]">
              <h1 className="text-[28px] font-[800] text-[#4B4B4B] text-center">{currentVocab.meaning}</h1>
            </div>
            <div className="w-full flex flex-col gap-[12px]">
              {options.map((opt) => {
                let btnClass = "w-full text-left justify-start h-auto min-h-[56px] py-[12px] px-[20px]";
                if (feedback) {
                  if (opt.id === currentVocab.id) btnClass += " !bg-[#58CC02] !border-[#46A302] !text-white";
                  else if (opt.id === selectedOption) btnClass += " !bg-[#FF4B4B] !border-[#EA2B2B] !text-white";
                  else btnClass += " opacity-50";
                }
                return (
                  <DuoButton key={opt.id} variant={selectedOption === opt.id ? "primary" : "ghost"} className={btnClass} onClick={() => checkQuizAnswer(opt)} disabled={!!feedback}>
                    <span className="text-[18px] font-[700]">{opt.word}</span>
                  </DuoButton>
                );
              })}
            </div>
          </div>
        );

      case 'quiz_listen':
        return (
          <div className={`flex flex-col items-center justify-center w-full h-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[32px]">Nghe và chọn nghĩa</h2>
            <div className="mb-[40px] animate-pulse">
              {renderSpeakerButtons(currentVocab.word)}
            </div>
            <div className="w-full flex flex-col gap-[12px]">
              {options.map((opt) => {
                let btnClass = "w-full text-left justify-start h-auto min-h-[56px] py-[12px] px-[20px]";
                if (feedback) {
                  if (opt.id === currentVocab.id) btnClass += " !bg-[#58CC02] !border-[#46A302] !text-white";
                  else if (opt.id === selectedOption) btnClass += " !bg-[#FF4B4B] !border-[#EA2B2B] !text-white";
                  else btnClass += " opacity-50";
                }
                return (
                  <DuoButton key={opt.id} variant={selectedOption === opt.id ? "primary" : "ghost"} className={btnClass} onClick={() => checkQuizAnswer(opt)} disabled={!!feedback}>
                    <span className="text-[16px]">{opt.meaning}</span>
                  </DuoButton>
                );
              })}
            </div>
          </div>
        );

      case 'type_word':
        return (
          <div className={`flex flex-col items-center justify-start w-full h-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[24px]">Viết lại từ này bằng tiếng Anh</h2>
            <div className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] rounded-[16px] p-[20px] flex flex-col items-center gap-[12px] mb-[32px]">
              <span className="text-[24px] font-[800] text-[#4B4B4B] text-center">{currentVocab.meaning}</span>
            </div>
            <form onSubmit={checkTypingAnswer} className="w-full flex flex-col gap-[16px]">
              <input 
                type="text" 
                className={`w-full h-[64px] border-2 rounded-[16px] px-[20px] text-[20px] font-[600] text-center outline-none transition-colors
                  ${feedback === 'correct' ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#58CC02]' : feedback === 'incorrect' ? 'bg-[#FF4B4B]/10 border-[#FF4B4B] text-[#FF4B4B]' : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#CE82FF] focus:border-[#CE82FF] focus:bg-white'}
                `}
                placeholder="Gõ từ tiếng Anh..."
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                disabled={!!feedback}
                autoFocus
              />
              {feedback === 'incorrect' && (
                <div className="text-center w-full bg-[#FF4B4B]/10 p-[16px] rounded-[16px]">
                  <p className="text-[14px] font-bold text-[#FF4B4B] mb-[4px]">Đáp án đúng là:</p>
                  <p className="text-[20px] font-[800] text-[#FF4B4B]">{currentVocab.word}</p>
                </div>
              )}
              {!feedback && <DuoButton type="submit" variant="primary" className="w-full mt-auto !bg-[#CE82FF] !border-[#CE82FF] shadow-[0_4px_0_0_#A855F7] active:shadow-none">Kiểm tra</DuoButton>}
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-full">
      <div className="flex flex-col px-[16px] py-[16px] sticky top-0 bg-white z-10">
        <div className="flex items-center justify-between mb-[12px]">
          <button onClick={() => navigate('/')} className="w-[32px] h-[32px] flex items-center justify-center text-[#AFAFAF] hover:bg-[#F7F7F7] rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <h1 className="text-[16px] font-[800] text-[#CE82FF] tracking-wide uppercase">
            Bài Kiểm Tra
          </h1>
          <div className="w-[32px]"></div>
        </div>
        <div className="w-full h-[16px] bg-[#E5E5E5] rounded-full overflow-hidden mb-[8px]">
          <div 
            className="h-full bg-[#CE82FF] transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-[4px] bg-white/20"></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[13px] font-[600] text-[#AFAFAF]">
          <span>Câu hỏi {currentIndex + 1} / {exercises.length}</span>
          <span className="text-[#CE82FF]">Điểm: {score}</span>
        </div>
      </div>

      <div className="flex-1 px-[16px] py-[24px] flex flex-col items-center">
        {renderGame()}
      </div>
    </div>
  );
};

export default TestPage;
