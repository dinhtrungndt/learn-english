import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';

const OnboardPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      title: "Lộ trình",
      subtitle: "linh hoạt",
      desc: "Cung cấp những nội dung học riêng cho mỗi mục tiêu khác nhau để giúp bạn đạt được thành quả tốt nhất.",
      imgBg: "bg-green-100",
      emoji: "📚"
    },
    {
      title: "Học tập",
      subtitle: "mọi lúc, mọi nơi",
      desc: "Không tiện học phát âm ở nơi đông người? Không có thời gian để hoàn thành bài học dài? Chúng tôi luôn có lựa chọn khác cho bạn!",
      imgBg: "bg-blue-100",
      emoji: "📱"
    },
    {
      title: "Đánh giá",
      subtitle: "chuyên sâu",
      desc: "Theo dõi và đánh giá từng kỹ năng bạn dựa trên từng loại bài tập.",
      imgBg: "bg-purple-100",
      emoji: "📊"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasSeenOnboard', 'true');
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col items-center justify-between p-[24px]">
      {/* Dots Indicator */}
      <div className="flex gap-[8px] mt-[40px]">
        {slides.map((_, idx) => (
          <div 
            key={idx} 
            className={`h-[8px] rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-[32px] bg-[#58CC02]' : 'w-[8px] bg-[#E5E5E5]'}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-[320px] text-center gap-[32px]">
        {/* Illustration Placeholder */}
        <div className={`w-[240px] h-[240px] rounded-full flex items-center justify-center text-[100px] ${slides[currentSlide].imgBg} transition-colors duration-500`}>
          {slides[currentSlide].emoji}
        </div>

        <div>
          <h2 className="text-[28px] font-[800] text-[#4B4B4B]">
            {slides[currentSlide].title}
          </h2>
          <h2 className="text-[28px] font-[800] text-[#58CC02] mb-[16px]">
            {slides[currentSlide].subtitle}
          </h2>
          <p className="text-[15px] text-[#777777] leading-[1.6]">
            {slides[currentSlide].desc}
          </p>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="w-full flex flex-col gap-[12px] mb-[20px]">
        {currentSlide === slides.length - 1 ? (
          <div className="flex gap-[12px] w-full">
            <DuoButton 
              variant="secondary" 
              className="flex-1 bg-[#F0FDF4] border-none shadow-none text-[#58CC02] hover:bg-[#DCFCE7]"
              onClick={() => {
                handleFinish();
                navigate('/login');
              }}
            >
              Đăng nhập
            </DuoButton>
            <DuoButton 
              variant="primary" 
              className="flex-1"
              onClick={() => {
                handleFinish();
                navigate('/signup');
              }}
            >
              Đăng ký
            </DuoButton>
          </div>
        ) : (
          <DuoButton variant="primary" onClick={handleNext}>Tiếp tục</DuoButton>
        )}
      </div>
    </div>
  );
};

export default OnboardPage;
