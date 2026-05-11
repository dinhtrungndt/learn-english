import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { useAuth } from '../../contexts/AuthContext';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!agreed) return;
    if (password !== confirmPassword) {
      setError('Mật khẩu nhập lại không khớp');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const name = username; // Default name to username

      await register({
        email,
        password, // Note: The backend will hash the password or the apiClient could handle it if necessary
        username,
        name,
        role: 'student'
      });

      navigate('/login');
    } catch (err) {
      setError(err.detail || 'Có lỗi xảy ra khi đăng ký');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#58CC02] flex flex-col items-center">
      <div className="pt-[60px] pb-[40px]">
        <h1 className="text-white text-[40px] font-[800] text-center">Learn E</h1>
      </div>

      <div className="flex-1 w-full bg-white rounded-t-[32px] px-[24px] pt-[32px] pb-[24px] flex flex-col shadow-[0_-8px_24px_rgba(0,0,0,0.1)]">
        <div className="text-center mb-[32px]">
          <h2 className="text-[24px] font-[800] text-[#4B4B4B]">Tạo tài khoản</h2>
          <p className="text-[15px] text-[#777777] mt-[4px]">và bắt đầu học tập ngay hôm nay!</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-[16px] flex-1">
          {error && <div className="text-[#FF4B4B] text-[14px] font-[600] text-center bg-[#FF4B4B]/10 p-[12px] rounded-[12px]">{error}</div>}
          
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full h-[52px] px-[20px] bg-[#F7F7F7] border-2 border-transparent rounded-[16px] text-[15px] font-[600] text-[#4B4B4B] placeholder:text-[#AFAFAF] focus:border-[#1CB0F6] focus:bg-white focus:outline-none transition-all"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full h-[52px] px-[20px] bg-[#F7F7F7] border-2 border-transparent rounded-[16px] text-[15px] font-[600] text-[#4B4B4B] placeholder:text-[#AFAFAF] focus:border-[#1CB0F6] focus:bg-white focus:outline-none transition-all"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-[52px] px-[20px] pr-[50px] bg-[#F7F7F7] border-2 border-transparent rounded-[16px] text-[15px] font-[600] text-[#4B4B4B] placeholder:text-[#AFAFAF] focus:border-[#1CB0F6] focus:bg-white focus:outline-none transition-all"
            />
            <span 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#AFAFAF] cursor-pointer font-bold select-none"
            >
              {showPassword ? '👁️‍🗨️' : '👁️'}
            </span>
          </div>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full h-[52px] px-[20px] pr-[50px] bg-[#F7F7F7] border-2 border-transparent rounded-[16px] text-[15px] font-[600] text-[#4B4B4B] placeholder:text-[#AFAFAF] focus:border-[#1CB0F6] focus:bg-white focus:outline-none transition-all"
            />
            <span 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-[16px] top-1/2 -translate-y-1/2 text-[#AFAFAF] cursor-pointer font-bold select-none"
            >
              {showConfirmPassword ? '👁️‍🗨️' : '👁️'}
            </span>
          </div>

          <div className="mt-[8px] flex items-center justify-between">
            <span className="text-[13px] text-[#777777] font-[600]">Liên kết tài khoản</span>
            <div className="flex gap-[12px]">
              <div className="w-[36px] h-[36px] bg-[#1877F2] rounded-[8px] flex items-center justify-center text-[16px] font-bold text-white cursor-pointer hover:bg-blue-600">f</div>
              <div className="w-[36px] h-[36px] bg-black rounded-[8px] flex items-center justify-center text-[16px] text-white cursor-pointer hover:bg-gray-800">🍎</div>
            </div>
          </div>

          <div className="mt-auto pt-[24px]">
            <label className="flex items-start gap-[12px] mb-[24px] cursor-pointer group">
              <div className={`w-[24px] h-[24px] shrink-0 rounded-[6px] border-2 flex items-center justify-center transition-colors ${agreed ? 'bg-[#58CC02] border-[#58CC02]' : 'border-[#E5E5E5] group-hover:border-[#58CC02]'}`}>
                {agreed && <span className="text-white text-[14px]">✓</span>}
              </div>
              <input type="checkbox" className="hidden" checked={agreed} onChange={() => setAgreed(!agreed)} />
              <span className="text-[13px] text-[#777777] font-[500] leading-[1.5]">
                Tôi đã đọc và đồng ý với <span className="text-[#58CC02] font-[700] hover:underline">Chính sách bảo mật</span> của ứng dụng.
              </span>
            </label>

            <DuoButton type="submit" variant="primary" disabled={!agreed || loading}>
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </DuoButton>
          </div>
          
          <div className="text-center mt-[16px]">
            <span className="text-[15px] text-[#777777] font-[600]">Đã có tài khoản? </span>
            <span onClick={() => navigate('/login')} className="text-[15px] text-[#58CC02] font-[800] cursor-pointer hover:underline">Đăng nhập</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
