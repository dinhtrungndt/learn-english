import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/home';
import Header from '../components/header';
import Footer from '../components/footer';

export const Routers = () => {
  return (
    <BrowserRouter>
      <div className="h-screen bg-gray-100 flex justify-center">
        <div className="w-full max-w-[480px] bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[20px]">
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  );
};
