import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Utiliza axios puro pois esta é uma tela pública (sem JWT Auth)
const apiURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:4020';

export function useScoreboardDisplayQuery(unidade) {
  const configQuery = useQuery({
    queryKey: ['publicScoreboardConfig', unidade],
    queryFn: async () => {
      const res = await axios.get(`${apiURL}/api/scoreboard/active/${unidade}`);
      return res.data;
    },
    enabled: !!unidade,
  });

  const votesQuery = useQuery({
    queryKey: ['publicScoreboardVotes', unidade],
    queryFn: async () => {
      // Cria a rota no backend: router.get('/votes/:unidade', scoreboardController.getVotesPublic);
      const res = await axios.get(`${apiURL}/api/scoreboard/votes/${unidade}`);
      return res.data;
    },
    enabled: !!unidade,
  });

  return {
    config: configQuery.data,
    votes: votesQuery.data || [],
    isLoading: configQuery.isLoading || votesQuery.isLoading,
  };
}