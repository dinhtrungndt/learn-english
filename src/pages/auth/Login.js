import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DuoButton from '../../components/ui/DuoButton';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password);
      // login successful, the router will handle redirecting since isAuthenticated will be true
      navigate('/');
    } catch (err) {
      setError(err.detail || 'Tài khoản hoặc mật khẩu không đúng');
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
          <h2 className="text-[24px] font-[800] text-[#4B4B4B]">Đăng nhập</h2>
          <p className="text-[15px] text-[#777777] mt-[4px]">để tiếp tục vươn tới mục tiêu!</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-[16px] flex-1">
          {error && <div className="text-[#FF4B4B] text-[14px] font-[600] text-center bg-[#FF4B4B]/10 p-[12px] rounded-[12px]">{error}</div>}
          
          <input
            type="text"
            placeholder="Tên đăng nhập / Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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

          <div className="text-right">
            <span className="text-[#777777] text-[13px] font-[600] cursor-pointer hover:text-[#1CB0F6]">Quên mật khẩu?</span>
          </div>

          <DuoButton type="submit" variant="primary" disabled={loading} className="mt-[8px]">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </DuoButton>

          <div className="mt-[24px] flex flex-col items-center">
            <span className="text-[13px] text-[#777777] font-[600] mb-[16px]">hoặc tiếp tục với</span>
            <div className="flex gap-[16px]">
              <div className="w-[56px] h-[56px] bg-[#F7F7F7] rounded-[16px] flex items-center justify-center text-[24px] font-bold cursor-pointer hover:bg-gray-200">G</div>
              <div className="w-[56px] h-[56px] bg-[#F7F7F7] rounded-[16px] flex items-center justify-center text-[24px] font-bold text-blue-600 cursor-pointer hover:bg-gray-200">f</div>
              <div className="w-[56px] h-[56px] bg-[#F7F7F7] rounded-[16px] flex items-center justify-center text-[24px] font-bold cursor-pointer hover:bg-gray-200">🍎</div>
            </div>
          </div>
        </form>

        <div className="text-center mt-[32px]">
          <span className="text-[15px] text-[#777777] font-[600]">Chưa có tài khoản? </span>
          <span onClick={() => navigate('/signup')} className="text-[15px] text-[#58CC02] font-[800] cursor-pointer hover:underline">Đăng ký ngay!</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
