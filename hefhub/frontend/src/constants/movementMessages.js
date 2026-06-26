export const MOVEMENT_MESSAGES = {
  0: 'A diversão está só começando! 🎉',
  5: 'A galera tá chegando... Que tal um drink pra começar? 🍻',
  10: 'A pista tá esquentando! Bora se enturmar e curtir o som. 🎶',
  15: 'Clima perfeito pra um drink e uma boa conversa. Quem sabe rola algo mais? 😉',
  20: 'A casa tá começando a encher. Ótimo momento para circular e conhecer gente nova. 👀',
  25: 'O ambiente tá ficando animado! A música tá boa e a galera tá entrando no clima. 💃',
  30: 'Já tem bastante gente bonita por aqui. Que tal se arriscar no labirinto? 😈',
  35: 'A pista de dança já é um bom lugar pra começar a caça. 🔥',
  40: 'A energia está alta! Desafie alguém com o olhar e veja o que acontece. 😏',
  45: 'Metade da casa cheia! As chances de um match estão aumentando... Aproveite! ✨',
  50: 'A casa está bombando! O labirinto está te chamando, não vai recusar o convite, né? 🥵',
  55: 'Clima quente! A pegação já começou a rolar solta. Não fique de fora! 💦',
  60: 'Se você ainda não se perdeu no labirinto, a hora é agora. O fervo tá lá! 🔥',
  65: 'Casa cheia, corpos suados e pouca roupa. O cenário perfeito pra se jogar! 😈',
  70: 'A tentação está por toda parte. Renda-se aos seus desejos mais secretos. 😉',
  75: 'Isto não é um teste: a pegação está LIBERADA! Corpos colados e beijos roubados. 👄',
  80: 'O labirinto está pegando fogo! O que acontece no Dédalos, fica no Dédalos. 🤫',
  85: 'Nível máximo de tesão no ar. Se você piscar, perde um beijo. 🔥',
  90: 'Casa LOTADA! Se você não sair daqui com uma história pra contar, fez errado. 😜',
  95: 'É o apocalipse da pegação! Explore cada canto, cada corpo. A noite é sua! 😈💦',
  100: 'SOLD OUT! A regra agora é se entregar sem medo! 🔥🥵',
};

const MOVEMENT_KEYS = Object.keys(MOVEMENT_MESSAGES)
  .map(Number)
  .sort((a, b) => b - a);

export const getMovementMessage = (percentage) => {
  const parsedPercentage = Number(percentage);

  const safePercentage = Number.isFinite(parsedPercentage)
    ? Math.max(0, Math.min(100, parsedPercentage))
    : 0;

  const rounded = Math.floor(safePercentage / 5) * 5;

  for (const key of MOVEMENT_KEYS) {
    if (rounded >= key) {
      return MOVEMENT_MESSAGES[key];
    }
  }

  return MOVEMENT_MESSAGES[0];
};