import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { SocketProvider } from './contexts/SocketContext';

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
              <Route path="/prices-edit" element={<PricesEdit />} />
              <Route path="*" element={<Navigate to="/prices-display" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </SocketProvider>
    </QueryClientProvider>
  );
}