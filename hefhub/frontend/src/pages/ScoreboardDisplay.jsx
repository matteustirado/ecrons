import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useQueryClient } from '@tanstack/react-query';
import { useScoreboardDisplayQuery } from '../hooks/useScoreboardDisplay';
import DisplayShell from '../components/views/scoreboard/DisplayShell';
import LandscapeLayout from '../components/views/scoreboard/LandscapeLayout';
import PortraitLayout from '../components/views/scoreboard/PortraitLayout';
import Thermometer from '../components/views/scoreboard/Thermometer';
import useKeepAlive from '../hooks/useKeepAlive';

export default function ScoreboardDisplay() {
  useKeepAlive();

  const { unidade = 'sp' } = useParams();

  const currentUnit = unidade.toUpperCase();
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { config, votes, isLoading } = useScoreboardDisplayQuery(currentUnit);

  const [crowdCount, setCrowdCount] = useState(0);
  const [socketMaxCapacity, setSocketMaxCapacity] = useState(null);

  const finalMaxCapacity = useMemo(() => {
    const socketCapacity = Number(socketMaxCapacity);

    if (Number.isFinite(socketCapacity) && socketCapacity > 0) {
      return socketCapacity;
    }

    const configCapacity = Number(config?.capacidadeMax);

    if (Number.isFinite(configCapacity) && configCapacity > 0) {
      return configCapacity;
    }

    if (currentUnit === 'RJ') return 426;
    if (currentUnit === 'BH') return 160;

    return 230;
  }, [socketMaxCapacity, config?.capacidadeMax, currentUnit]);

  const crowdPercentage = useMemo(() => {
    const count = Number(crowdCount);

    if (!Number.isFinite(count) || count <= 0 || finalMaxCapacity <= 0) {
      return 0;
    }

    return Math.min((count / finalMaxCapacity) * 100, 100);
  }, [crowdCount, finalMaxCapacity]);

  useEffect(() => {
    if (!socket) return;

    const room = `unidade_${currentUnit}`;

    const handleConfigUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ['publicScoreboardConfig', currentUnit],
      });
    };

    const handleVoteCast = (data) => {
      if (data?.currentVotes) {
        queryClient.setQueryData(
          ['publicScoreboardVotes', currentUnit],
          data.currentVotes
        );

        return;
      }

      queryClient.invalidateQueries({
        queryKey: ['publicScoreboardVotes', currentUnit],
      });
    };

    const handleCrowdUpdate = (data) => {
      const quantidadeAberta = Number(data?.quantidade_aberta);
      const capacidadeMax = Number(data?.capacidadeMax);

      if (Number.isFinite(quantidadeAberta) && quantidadeAberta >= 0) {
        setCrowdCount(quantidadeAberta);
      }

      if (Number.isFinite(capacidadeMax) && capacidadeMax > 0) {
        setSocketMaxCapacity(capacidadeMax);
      }
    };

    const joinUnitRoom = () => {
      if (!socket.connected) {
        return;
      }

      socket.emit('join_room', room);
    };

    socket.on('scoreboard:update', handleConfigUpdate);
    socket.on('game_vote_cast', handleVoteCast);
    socket.on('crowd:update', handleCrowdUpdate);

    socket.on('connect', joinUnitRoom);

    if (socket.connected) {
      joinUnitRoom();
    }

    return () => {
      socket.off('connect', joinUnitRoom);
      socket.off('scoreboard:update', handleConfigUpdate);
      socket.off('game_vote_cast', handleVoteCast);
      socket.off('crowd:update', handleCrowdUpdate);

      if (socket.connected) {
        socket.emit('leave_room', room);
      }
    };
  }, [socket, currentUnit, queryClient]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const link = document.createElement('link');

    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@300..700&display=swap';

    link.rel = 'stylesheet';

    document.head.appendChild(link);

    return () => {
      document.body.style.overflow = 'auto';

      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const processedOptions = useMemo(() => {
    if (!config?.opcoes) {
      return [];
    }

    const votesMap = {};

    if (Array.isArray(votes)) {
      votes.forEach((vote) => {
        votesMap[vote.option_index] = vote._count
          ? vote._count.option_index
          : vote.count;
      });
    }

    const totalVotes = Object.values(votesMap).reduce(
      (accumulator, currentValue) => accumulator + Number(currentValue || 0),
      0
    );

    const options = config.opcoes.map((option, index) => {
      const count = Number(votesMap[index]) || 0;

      const percentage =
        totalVotes > 0 ? (count / totalVotes) * 100 : 0;

      const color = option.cor || '#ff4d00';

      return {
        ...option,
        count,
        percentage,
        color,
      };
    });

    return options.sort((a, b) => b.count - a.count);
  }, [config, votes]);

  if (isLoading || !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] font-bold tracking-widest text-white tabular-nums">
        CARREGANDO SISTEMA...
      </div>
    );
  }

  const isLandscape =
    (config.layout || 'landscape').toLowerCase() === 'landscape';

  return (
    <DisplayShell
      isConnected={socket?.connected}
      isLandscape={isLandscape}
      titulo={config.titulo || 'PLACAR DEDALOS'}
    >
      {isLandscape ? (
        <LandscapeLayout options={processedOptions} />
      ) : (
        <PortraitLayout options={processedOptions} />
      )}

      <Thermometer
        crowdPercentage={crowdPercentage}
        isLandscape={isLandscape}
      />
    </DisplayShell>
  );
}