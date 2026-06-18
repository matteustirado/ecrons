import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SocketProvider } from './contexts/SocketContext';
import AuthGuard from './components/auth/AuthGuard';
import AuthCallback from './pages/AuthCallback';
import AppLayout from './components/layout/AppLayout';

const queryClient = new QueryClient();

const PricesEdit = lazy(() => import('./pages/PricesEdit'));
const PricesDisplay = lazy(() => import('./pages/PricesDisplay'));

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center bg-black text-white">Carregando...</div>}>
            <Routes>
              <Route path="/prices-display/:unidade?" element={<PricesDisplay />} />
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
              <Route path="/" element={<Navigate to="/prices-edit" replace />} />
              <Route path="*" element={<Navigate to="/prices-edit" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SocketProvider>
    </QueryClientProvider>
  );
}