import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/home';
import Header from '../components/header';
import Footer from '../components/footer';

export const Routers = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};
