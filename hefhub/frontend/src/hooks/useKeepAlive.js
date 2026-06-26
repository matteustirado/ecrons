import { useEffect } from 'react';

export default function useKeepAlive() {
  useEffect(() => {
    let wakeLock = null;

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (error) {
        console.warn('[KeepAlive] WakeLock ignorado ou não suportado:', error.message);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    const createSilentAudio = () => {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      );
      audio.loop = true;
      audio.play().catch((error) => {
        console.warn('[KeepAlive] Audio bloqueado pelo navegador:', error.message);
      });
      
      document.removeEventListener('click', createSilentAudio);
      document.removeEventListener('touchstart', createSilentAudio);
    };

    document.addEventListener('click', createSilentAudio);
    document.addEventListener('touchstart', createSilentAudio);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', createSilentAudio);
      document.removeEventListener('touchstart', createSilentAudio);
      
      if (wakeLock !== null) {
        wakeLock.release().catch((error) => {
          console.warn('[KeepAlive] Falha ao liberar WakeLock:', error.message);
        });
      }
    };
  }, []);
}