import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'; // ✅ FIXED
import { AuthContext, AuthProvider } from './context/AuthContext.jsx';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import CreditReport from './pages/CreditReport';
import History from './pages/History';
import ImproveScore from './pages/ImproveScore';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import CompleteProfile from './pages/CompleteProfile';
import AdminPanel from './pages/AdminPanel';
// import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import FraudCheckerOverlay from './components/FraudCheckerOverlay';
import './styles/global.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, token } = useContext(AuthContext);
  const isLoggedIn = !!(user && token);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Profile Completion Route
function ProfileRoute({ children }) {
  const { user, token } = useContext(AuthContext);
  const isLoggedIn = !!(user && token);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (user?.isDemo || user?.profileCompleted) {
    return children;
  }

  return <Navigate to="/complete-profile" replace />;
}

// Landing Page Route
function LandingPageRoute({ children }) {
  const { user, token } = useContext(AuthContext);
  const isLoggedIn = !!(user && token);

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}



function AppContent() {
  const [isFraudOpen, setIsFraudOpen] = React.useState(false);

  const location = useLocation();
  const showGlobalNav = !(location.pathname === '/' || location.pathname === '/index');

  return (
    <>
      {showGlobalNav && (
        <>
          <Navbar onFraudClick={() => setIsFraudOpen((prev) => !prev)} />
          <FraudCheckerOverlay
            isOpen={isFraudOpen}
            onClose={() => setIsFraudOpen(false)}
          />
        </>
      )}

      {/* ✅ FIX: NO Router here */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <LandingPageRoute>
              <Index />
            </LandingPageRoute>
          }
        />
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/complete-profile"
          element={
            <ProtectedRoute>
              <CompleteProfile />
            </ProtectedRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credit-report"
          element={
            <ProfileRoute>
              <CreditReport />
            </ProfileRoute>
          }
        />

        <Route
          path="/history"
          element={
            <ProfileRoute>
              <History />
            </ProfileRoute>
          }
        />

        <Route
          path="/improve-score"
          element={
            <ProfileRoute>
              <ImproveScore />
            </ProfileRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProfileRoute>
              <Profile />
            </ProfileRoute>
          }
        />

        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}

      </Routes>


    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;