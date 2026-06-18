import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';
import { SocketContext } from './SocketContext';

export function SocketProvider({ children }) {
  const { accessToken } = useAuthStore();
  const [socketState, setSocketState] = useState({
    socket: null,
    isConnected: false,
  });

  useEffect(() => {
    if (!accessToken) return;

    const socketUrl = import.meta.env.VITE_API_URL.replace('/api', '');

    const socketInstance = io(socketUrl, {
      auth: { token: accessToken },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });

    const handleConnect = () => {
      setSocketState({ socket: socketInstance, isConnected: true });
    };

    const handleDisconnect = () => {
      setSocketState({ socket: socketInstance, isConnected: false });
    };

    socketInstance.on('connect', handleConnect);
    socketInstance.on('disconnect', handleDisconnect);
    socketInstance.on('connect_error', handleDisconnect);

    return () => {
      socketInstance.disconnect();
      setSocketState({ socket: null, isConnected: false });
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
}