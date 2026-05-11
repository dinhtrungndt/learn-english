import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Footer from '../components/footer';
import Header from '../components/header';
import { useAuth } from '../contexts/AuthContext';
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import HomePage from '../pages/home';
import OnboardPage from '../pages/onboard';
import ProfilePage from '../pages/profile';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const hasSeenOnboard = localStorage.getItem('hasSeenOnboard');

  if (loading) return null;

  if (!isAuthenticated) {
    if (!hasSeenOnboard) {
      return <Navigate to="/onboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Public Route Wrapper (redirects to Home if already logged in)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// Layout for the main app (with Header and Footer)
const MainLayout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[20px]">
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

// Layout for Auth/Onboard pages (no Header/Footer, full screen)
const AuthLayout = ({ children }) => {
  return (
    <div className="h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-[480px] bg-white h-screen flex flex-col shadow-2xl relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export const Routers = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <HomePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Dummy Routes for tabs */}
        <Route path="/practice" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />
        <Route path="/quests" element={<ProtectedRoute><MainLayout><HomePage /></MainLayout></ProtectedRoute>} />

        {/* Public Routes */}
        <Route 
          path="/onboard"
          element={
            <PublicRoute>
              <AuthLayout>
                <OnboardPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            </PublicRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
