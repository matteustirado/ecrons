/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket precisa ser usado dentro de um SocketProvider');
  }
  return context;
}

export function SocketProvider({ children }) {
  const [socket] = useState(() => {
    const url = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : 'https://hefhub2-api.dedalosbar.com';

    return io(url, {
      transports: ['websocket', 'polling'],
    });
  });

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}