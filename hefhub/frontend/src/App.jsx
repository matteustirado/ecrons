import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { SocketProvider } from './contexts/SocketContext';
import AuthGuard from './components/auth/AuthGuard';
import AuthCallback from './pages/AuthCallback';
import AppLayout from './components/layout/AppLayout';

const queryClient = new QueryClient();

const PricesEdit = lazy(() => import('./pages/PricesEdit'));
const PricesDisplay = lazy(() => import('./pages/PricesDisplay'));

const ScoreboardEdit = lazy(() => import('./pages/ScoreboardEdit'));
const ScoreboardDisplay = lazy(() => import('./pages/ScoreboardDisplay'));
const ScoreboardGame = lazy(() => import('./pages/ScoreboardGame'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-dvh w-full items-center justify-center bg-[#050505] text-white">Carregando...</div>}>
            <Routes>
              <Route path="/prices-display/:unidade?" element={<PricesDisplay />} />
              <Route path="/scoreboard-display/:unidade?" element={<ScoreboardDisplay />} />
              <Route path="/scoreboard-game/:unidade?" element={<ScoreboardGame />} />

              <Route path="/auth/callback" element={<AuthCallback />} />
              
              <Route 
                path="/prices-edit" 
                element={
                  <AuthGuard allowedRoles={['admin-sp', 'admin-rj', 'admin-bh', 'admin-hefhub-sp', 'admin-hefhub-rj', 'admin-hefhub-bh']}>
                    <AppLayout>
                      <PricesEdit />
                    </AppLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/scoreboard-edit" 
                element={
                  <AuthGuard allowedRoles={['admin-sp', 'admin-rj', 'admin-bh', 'admin-hefhub-sp', 'admin-hefhub-rj', 'admin-hefhub-bh']}>
                    <AppLayout>
                      <ScoreboardEdit />
                    </AppLayout>
                  </AuthGuard>
                } 
              />

              <Route path="/" element={<Navigate to="/prices-edit" replace />} />
              <Route path="*" element={<Navigate to="/prices-edit" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SocketProvider>

      <ToastContainer 
        position="bottom-right" 
        autoClose={3500} 
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
        toastClassName="bg-[#121212] backdrop-blur-2xl border border-white/10 text-white font-bold tracking-wide rounded-2xl shadow-2xl"
      />
    </QueryClientProvider>
  );
}