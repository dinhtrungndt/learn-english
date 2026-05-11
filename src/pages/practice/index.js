import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { getVocabulariesForReview, getAllVocabularies, reviewVocabulary } from '../../services/vocabService';
import { playAudio } from '../../utils/speech';

const PracticePage = () => {
  const navigate = useNavigate();
  
  // Data
  const [vocabList, setVocabList] = useState([]); // Danh sách từ cần ôn ban đầu
  const [allVocabs, setAllVocabs] = useState([]); // Dùng làm đáp án nhiễu
  
  // Game Engine State
  const [exercises, setExercises] = useState([]); // Hàng đợi các câu hỏi
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakes, setMistakes] = useState(new Set()); // Lưu ID các từ đã làm sai
  const [isFreePractice, setIsFreePractice] = useState(false); // Đánh dấu vòng luyện thêm
  const [isCompleted, setIsCompleted] = useState(false);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false); // Trạng thái đang đồng bộ kết quả lên server
  
  // Current Exercise State
  const [options, setOptions] = useState([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState('');
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [reviewData, allData] = await Promise.all([
        getVocabulariesForReview(),
        getAllVocabularies()
      ]);
      setVocabList(reviewData);
      setAllVocabs(allData);
      
      if (reviewData.length > 0) {
        startSession(reviewData, allData, false);
      }
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

    let newExercises = [];
    reviewData.forEach(vocab => {
      // Bỏ túi 4 chạm cho mỗi từ
      newExercises.push({ type: 'flashcard', vocab });
      newExercises.push({ type: 'type_word', vocab });
      
      // Chỉ bốc Trắc nghiệm nếu trong sổ có đủ 4 từ làm đáp án nhiễu
      if (allData.length >= 4) {
        newExercises.push({ type: 'quiz_en_to_vi', vocab });
        newExercises.push({ type: 'quiz_listen', vocab });
      }
    });

    // Trộn ngẫu nhiên
    newExercises = newExercises.sort(() => Math.random() - 0.5);
    setExercises(newExercises);
    setupExercise(0, newExercises, allData);
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
      playAudio('Correct', 'normal', 'en-US'); // Hiệu ứng âm thanh tạm
    } else {
      // Ghi nhận lỗi sai
      setMistakes(prev => {
        const newSet = new Set(prev);
        newSet.add(currentExercise.vocab.id);
        return newSet;
      });
      // Đẩy câu hỏi này xuống cuối hàng đợi để bắt làm lại
      setExercises(prev => [...prev, { ...currentExercise }]);
    }

    // Chuyển câu
    const isFlashcard = currentExercise.type === 'flashcard';
    const delay = isFlashcard ? 0 : (isCorrect ? 1000 : 2000); // Trả lời sai cho nhìn đáp án lâu hơn chút
    
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      // Dùng exercises lẫy từ state mới nhất phòng trường hợp vừa push thêm câu sai
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
    
    // Nếu là chế độ Luyện thêm tự do, không cần gọi API tính điểm nữa
    if (isFreePractice) return;

    try {
      setSyncing(true);
      // Cập nhật SRS cho từng từ
      const promises = vocabList.map(vocab => {
        // Chỉ cần sai ở 1 game bất kỳ là bị đánh dấu Quên
        const isRemembered = !mistakes.has(vocab.id);
        return reviewVocabulary(vocab.id, isRemembered);
      });
      await Promise.all(promises);
    } catch (err) {
      console.error('Lỗi đồng bộ:', err);
    } finally {
      setSyncing(false);
    }
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
        <div className="animate-spin w-8 h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Màn hình hoàn thành
  if (isCompleted) {
    return (
      <div className="w-full flex flex-col bg-white min-h-full items-center justify-center p-[24px] text-center">
        <div className="text-[80px] mb-[16px]">🎉</div>
        <h2 className="text-[24px] font-bold text-[#4B4B4B] mb-[8px]">Tuyệt đỉnh!</h2>
        
        {syncing ? (
          <div className="flex flex-col items-center mt-[16px]">
            <div className="animate-spin w-6 h-6 border-4 border-[#1CB0F6] border-t-transparent rounded-full mb-[8px]"></div>
            <p className="text-[#AFAFAF] font-[600]">Đang lưu kết quả học tập...</p>
          </div>
        ) : (
          <>
            <p className="text-[16px] text-[#AFAFAF] mb-[32px] font-[500]">
              Bạn đã hoàn thành phiên huấn luyện cường độ cao.<br/>Trí nhớ của bạn đang ngày càng xuất sắc!
            </p>
            <div className="flex flex-col gap-[12px] w-full max-w-[300px]">
              <DuoButton 
                variant="primary" 
                onClick={() => startSession(vocabList, allVocabs, true)} // Bật chế độ luyện thêm
                className="w-full"
              >
                Luyện tập lại vòng nữa
              </DuoButton>
              <DuoButton 
                variant="ghost" 
                onClick={() => navigate('/')} 
                className="w-full border-2 border-[#E5E5E5]"
              >
                Về Trang Chủ
              </DuoButton>
            </div>
          </>
        )}
      </div>
    );
  }

  if (vocabList.length === 0) {
    return (
      <div className="w-full flex flex-col bg-white min-h-full">
        <div className="flex items-center justify-between px-[16px] py-[16px] border-b-2 border-[#E5E5E5] sticky top-0 bg-white z-10">
          <h1 className="text-[20px] font-bold text-[#4B4B4B]">Ôn tập</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-[24px] text-center">
          <div className="w-[120px] h-[120px] bg-[#F7F7F7] rounded-full flex items-center justify-center text-[48px] border-4 border-[#E5E5E5] mb-[24px]">🌱</div>
          <h2 className="text-[20px] font-bold text-[#4B4B4B] mb-[8px]">Chưa có từ nào cần ôn</h2>
          <p className="text-[15px] text-[#AFAFAF] mb-[32px] font-[500]">
            Bạn đã ôn hết từ vựng của hôm nay rồi. Hãy quay lại xem YouTube và thêm từ mới nhé!
          </p>
          <DuoButton onClick={() => navigate('/add-word')} className="w-full mb-[16px]">
            Thêm từ mới ngay
          </DuoButton>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentIndex];
  if (!currentExercise) return null; // Safety check
  
  const currentVocab = currentExercise.vocab;
  const progress = ((currentIndex) / exercises.length) * 100;

  const renderSpeakerButtons = (word) => (
    <div className="flex items-center gap-[12px] z-20">
      <button onClick={(e) => { e.stopPropagation(); playAudio(word, 'slow'); }} className="w-[40px] h-[40px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center font-bold text-[14px] hover:bg-[#1CB0F6]/20 transition-colors">
        0.5x
      </button>
      <button onClick={(e) => { e.stopPropagation(); playAudio(word, 'normal'); }} className="w-[56px] h-[56px] bg-[#1CB0F6] text-white rounded-full flex items-center justify-center shadow-[0_4px_0_#1899D6] active:shadow-[0_0_0_#1899D6] active:translate-y-[4px] transition-all">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); playAudio(word, 'fast'); }} className="w-[40px] h-[40px] bg-[#1CB0F6]/10 text-[#1CB0F6] rounded-full flex items-center justify-center font-bold text-[14px] hover:bg-[#1CB0F6]/20 transition-colors">
        1.5x
      </button>
    </div>
  );

  const renderGame = () => {
    switch (currentExercise.type) {
      case 'quiz_en_to_vi':
        return (
          <div className={`flex flex-col items-center justify-center w-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[12px]">Nghĩa của từ này là gì?</h2>
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

      case 'quiz_listen':
        return (
          <div className={`flex flex-col items-center justify-center w-full ${feedback === 'incorrect' ? 'animate-shake' : ''}`}>
            <h2 className="text-[20px] font-bold text-[#AFAFAF] mb-[32px]">Nghe và chọn nghĩa đúng</h2>
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
              {currentVocab.example && <span className="text-[15px] font-[500] text-[#777777] italic text-center">"{currentVocab.example}"</span>}
            </div>
            <form onSubmit={checkTypingAnswer} className="w-full flex flex-col gap-[16px]">
              <input 
                type="text" 
                className={`w-full h-[64px] border-2 rounded-[16px] px-[20px] text-[20px] font-[600] text-center outline-none transition-colors
                  ${feedback === 'correct' ? 'bg-[#58CC02]/10 border-[#58CC02] text-[#58CC02]' : feedback === 'incorrect' ? 'bg-[#FF4B4B]/10 border-[#FF4B4B] text-[#FF4B4B]' : 'bg-[#F7F7F7] border-[#E5E5E5] text-[#1CB0F6] focus:border-[#1CB0F6] focus:bg-white'}
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
              {!feedback && <DuoButton type="submit" variant="primary" className="w-full mt-auto">Kiểm tra</DuoButton>}
            </form>
          </div>
        );

      case 'flashcard':
      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center perspective-1000 w-full">
            <div 
              className={`w-full max-w-[340px] aspect-[3/4] relative transition-transform duration-500 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
              onClick={() => {
                if (!isFlipped) {
                  setIsFlipped(true);
                  playAudio(currentVocab.word, 'normal');
                }
              }}
            >
              <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-[#E5E5E5] rounded-[24px] shadow-sm flex flex-col items-center justify-center p-[24px] hover:border-[#1CB0F6] hover:bg-[#F0F9FF] transition-colors">
                <span className="text-[14px] font-[700] text-[#1CB0F6] uppercase tracking-wider mb-[24px]">Từ vựng</span>
                <h2 className="text-[32px] font-bold text-[#4B4B4B] text-center break-words w-full">{currentVocab.word}</h2>
                <div className="mt-[48px] text-[15px] font-[600] text-[#AFAFAF] animate-pulse">Chạm để xem nghĩa</div>
              </div>

              <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-2 border-[#1CB0F6] rounded-[24px] shadow-md flex flex-col items-center justify-center p-[24px] rotate-y-180">
                <span className="text-[14px] font-[700] text-[#1CB0F6] uppercase tracking-wider mb-[24px]">Ý nghĩa</span>
                <h2 className="text-[28px] font-bold text-[#4B4B4B] text-center break-words w-full mb-[16px]">{currentVocab.meaning}</h2>
                <div className="mb-[24px]">{renderSpeakerButtons(currentVocab.word)}</div>
                {currentVocab.example && (
                  <div className="w-full bg-[#F7F7F7] p-[16px] rounded-[16px] border border-[#E5E5E5]">
                    <p className="text-[14px] font-[600] text-[#777777] italic mb-[8px]">Ví dụ:</p>
                    <p className="text-[16px] font-[500] text-[#4B4B4B]">{currentVocab.example}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="w-full pt-[32px] flex gap-[12px] h-[80px]">
              {isFlipped ? (
                <>
                  <DuoButton variant="danger" className="flex-1" onClick={() => submitAnswer(false)}>Quên rồi</DuoButton>
                  <DuoButton variant="primary" className="flex-1" onClick={() => submitAnswer(true)}>Đã nhớ</DuoButton>
                </>
              ) : (
                <DuoButton className="w-full" onClick={() => { setIsFlipped(true); playAudio(currentVocab.word, 'normal'); }}>Lật thẻ</DuoButton>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full flex flex-col bg-white min-h-full">
      <div className="flex flex-col px-[16px] py-[16px] sticky top-0 bg-white z-10">
        <div className="flex items-center justify-center mb-[12px]">
          <h1 className="text-[16px] font-[600] text-[#AFAFAF]">
            {isFreePractice ? "🎯 Luyện tập thêm" : "🔥 Ôn tập hàng ngày"}
          </h1>
        </div>
        <div className="w-full h-[16px] bg-[#E5E5E5] rounded-full overflow-hidden mb-[8px]">
          <div 
            className="h-full bg-[#58CC02] transition-all duration-500 ease-out rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute top-0 left-0 w-full h-[4px] bg-white/20"></div>
          </div>
        </div>
        <div className="flex items-center justify-between text-[13px] font-[600] text-[#AFAFAF]">
          <span>Chướng ngại vật: {currentIndex} / {exercises.length}</span>
          <span className="text-[#FF4B4B]">Lỗi: {mistakes.size}</span>
        </div>
      </div>

      <div className="flex-1 px-[16px] py-[24px] flex flex-col items-center">
        {renderGame()}
      </div>
    </div>
  );
};

export default PracticePage;
