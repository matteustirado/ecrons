import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuthStore } from '../stores/authStore';
import { useSocket } from '../contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useScoreboardAdminQuery } from '../hooks/useScoreboardAdmin';
import { useGameTechDebtStore } from '../stores/gameTechDebtStore';
import GameShell from '../components/views/scoreboard/game/GameShell';
import IdleView from '../components/views/scoreboard/game/IdleView';
import VotingView from '../components/views/scoreboard/game/VotingView';
import SuccessView from '../components/views/scoreboard/game/SuccessView';
import useKeepAlive from '../hooks/useKeepAlive';

export default function ScoreboardGame() {
  useKeepAlive();

  const { unidade } = useParams();
  const { user } = useAuthStore();
  
  const currentUnit = unidade 
    ? unidade.toUpperCase() 
    : (user?.unidade ? user.unidade.toUpperCase() : 'SP');

  const queryClient = useQueryClient();
  const socket = useSocket();
  
  const { data: config, isLoading } = useScoreboardAdminQuery(currentUnit);

  const { isGameUnlocked, lockGame, unlockGame } = useGameTechDebtStore();
  const [viewState, setViewState] = useState('idle');
  const [votedOption, setVotedOption] = useState(null);
  const [exitClicks, setExitClicks] = useState(0);

  const idleTimerRef = useRef(null);
  const successTimerRef = useRef(null);
  const isSessionLockedRef = useRef(false);

  useEffect(() => {
    if (!socket) return;
    
    socket.emit('join_room', `unidade_${currentUnit}`);
    
    const handleConfigUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['scoreboardAdmin', currentUnit] });
    };

    socket.on('scoreboard:update', handleConfigUpdate);

    return () => {
      socket.off('scoreboard:update', handleConfigUpdate);
      socket.emit('leave_room', `unidade_${currentUnit}`);
    };
  }, [socket, currentUnit, queryClient]);

  useEffect(() => {
    let timeout;
    if (exitClicks > 0 && exitClicks < 5) {
      timeout = setTimeout(() => setExitClicks(0), 3000);
    } else if (exitClicks >= 5) {
      localStorage.removeItem('hefhub_user');
      localStorage.removeItem('hefhub_token');
      window.location.href = '/login';
    }
    return () => clearTimeout(timeout);
  }, [exitClicks]);

  const handleHiddenClick = () => setExitClicks((prev) => prev + 1);

  const clearTimers = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (successTimerRef.current) clearTimeout(successTimerRef.current);
  }, []);

  const startVotingSession = useCallback(() => {
    if (isSessionLockedRef.current) return;
    clearTimers();
    setViewState('voting');
    isSessionLockedRef.current = true;
    idleTimerRef.current = setTimeout(() => {
      setViewState('idle');
      isSessionLockedRef.current = false;
      lockGame();
    }, 20000);
  }, [clearTimers, lockGame]);

  useEffect(() => {
    if (isGameUnlocked && viewState === 'idle') {
      startVotingSession();
    }
  }, [isGameUnlocked, viewState, startVotingSession]);

  const handleVote = async (index, optionName) => {
    if (navigator.vibrate) navigator.vibrate(50);
    clearTimers();

    try {
      await axiosClient.post('/scoreboard/vote', {
        unidade: currentUnit,
        optionIndex: index,
        cliente_id: 'VOTO-BALCAO'
      });

      setVotedOption(optionName);
      setViewState('success');

      successTimerRef.current = setTimeout(() => {
        setViewState('idle');
        setVotedOption(null);
        isSessionLockedRef.current = false;
        lockGame();
      }, 5000);
    } catch {
      setTimeout(() => {
        setViewState('idle');
        isSessionLockedRef.current = false;
        lockGame();
      }, 2000);
    }
  };

  const cancelSession = useCallback(() => {
    clearTimers();
    setViewState('idle');
    isSessionLockedRef.current = false;
    lockGame();
  }, [clearTimers, lockGame]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#050505] font-black uppercase tracking-widest text-white/50 animate-pulse">
        Carregando Sistema...
      </div>
    );
  }

  return (
    <GameShell onHiddenClick={handleHiddenClick} unlockGame={unlockGame}>
      {viewState === 'idle' && <IdleView onStart={startVotingSession} />}
      {viewState === 'voting' && <VotingView config={config} handleVote={handleVote} cancelSession={cancelSession} />}
      {viewState === 'success' && <SuccessView votedOption={votedOption} />}
    </GameShell>
  );
}