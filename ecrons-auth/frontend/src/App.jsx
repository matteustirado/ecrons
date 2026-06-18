import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './stores/authStore';

function PrivateRoute({ children }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function RedirectToLogin() {
  const location = useLocation();
  return <Navigate to={`/login${location.search}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectToLogin />} />
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}