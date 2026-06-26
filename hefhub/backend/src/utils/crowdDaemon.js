const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const { getIO } = require('./socket');
const scoreboardService = require('../services/scoreboardService');
const { setCrowdState } = require('../services/crowdState');

const prisma = new PrismaClient();

const UNIDADES = ['SP', 'BH', 'RJ'];

const SLUGS = {
  SP: 'sao-paulo',
  BH: 'belo-horizonte',
  RJ: 'rio-de-janeiro',
};

let monitorInterval = null;
let cycleInProgress = false;

const normalizeBaseUrl = (url) => {
  return String(url || '').replace(/\/+$/, '');
};

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const getApiConfig = (unidade) => {
  const url =
    process.env[`SITE_MAE_URL_${unidade}`] ||
    process.env.SITE_MAE_URL ||
    'https://www.sistemadedalos.com';

  const token =
    process.env[`SITE_MAE_TOKEN_${unidade}`] ||
    process.env.SITE_MAE_TOKEN;

  return {
    url: normalizeBaseUrl(url),
    token,
  };
};

const getDefaultCapacity = (unidade) => {
  if (unidade === 'RJ') return 426;
  if (unidade === 'BH') return 160;
  return 230;
};

const fetchCrowdForUnit = async (unidade) => {
  const config = getApiConfig(unidade);
  const slug = SLUGS[unidade];

  if (!config.url || !config.token || !slug) {
    console.warn(
      `[CrowdDaemon] [${unidade}] URL, token ou slug ausente. Unidade ignorada.`
    );

    return null;
  }

  const endpoint = `${config.url}/api/bar/v1/ocupacao/?unidade_slug=${encodeURIComponent(slug)}`;

  try {
    console.log(
      `[CrowdDaemon] [${unidade}] Consultando ocupação em: ${endpoint}`
    );

    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${config.token}`,
      },
      timeout: 10000,
    });

    const quantidadeAberta = Math.max(
      0,
      normalizeNumber(response.data?.quantidade_aberta)
    );

    console.log(
      `[CrowdDaemon] [${unidade}] Ocupação recebida: ${quantidadeAberta}`
    );

    return {
      unidade,
      quantidade_aberta: quantidadeAberta,
      atualizadoEm: response.data?.atualizado_em || new Date().toISOString(),
    };
  } catch (error) {
    const status = error.response?.status;
    const apiData = error.response?.data;

    console.error(
      `[CrowdDaemon] [${unidade}] Falha ao consultar lotação: ${error.message}`
    );

    if (status) {
      console.error(
        `[CrowdDaemon] [${unidade}] API respondeu ${status}:`,
        apiData
      );
    }

    return null;
  }
};

const getCapacityForUnit = async (unidade) => {
  try {
    const configPlacar = await prisma.scoreboardConfig.findUnique({
      where: {
        unidade,
      },
    });

    const configuredCapacity = normalizeNumber(configPlacar?.capacidadeMax);

    if (configuredCapacity > 0) {
      return configuredCapacity;
    }

    return getDefaultCapacity(unidade);
  } catch (error) {
    console.error(
      `[CrowdDaemon] [${unidade}] Falha ao buscar capacidade no banco:`,
      error.message
    );

    return getDefaultCapacity(unidade);
  }
};

const syncVotesAfterCapacityLimit = async (unidade, excesso, io) => {
  if (excesso <= 0) return;

  console.log(
    `[CrowdDaemon] [${unidade}] Excesso detectado: ${excesso}. Sincronizando votos dos totens.`
  );

  try {
    const currentVotes = await prisma.scoreboardVote.groupBy({
      by: ['option_index'],
      where: {
        unidade,
        status: 'DENTRO',
      },
      _count: {
        option_index: true,
      },
    });

    io.to(`unidade_${unidade}`).emit('game_vote_cast', {
      currentVotes,
    });
  } catch (error) {
    console.error(
      `[CrowdDaemon] [${unidade}] Falha ao sincronizar votos após limite:`,
      error.message
    );
  }
};

const processCrowdResult = async (result, io) => {
  if (!result) return;

  const { unidade, quantidade_aberta, atualizadoEm } = result;

  const capacidadeMax = await getCapacityForUnit(unidade);

  const payload = {
    quantidade_aberta: quantidade_aberta,
    capacidadeMax,
    atualizadoEm,
  };

  setCrowdState(unidade, payload);

  console.log(
    `[CrowdDaemon] [${unidade}] Emitindo crowd:update -> ${quantidade_aberta}/${capacidadeMax}`
  );

  io.to(`unidade_${unidade}`).emit('crowd:update', payload);

  try {
    const excesso = await scoreboardService.enforceCapacityLimit(
      unidade,
      quantidade_aberta
    );

    await syncVotesAfterCapacityLimit(unidade, excesso, io);
  } catch (error) {
    console.error(
      `[CrowdDaemon] [${unidade}] Falha ao aplicar limite de capacidade:`,
      error.message
    );
  }
};

const runCrowdCycle = async () => {
  if (cycleInProgress) {
    console.warn(
      '[CrowdDaemon] Ciclo anterior ainda em andamento. Novo ciclo ignorado.'
    );
    return;
  }

  cycleInProgress = true;

  console.log('\n[CrowdDaemon] --- Iniciando ciclo de lotação ---');

  try {
    const io = getIO();

    if (!io) {
      console.error(
        '[CrowdDaemon] Socket.IO ainda não foi inicializado. Ciclo cancelado.'
      );
      return;
    }

    const results = await Promise.all(
      UNIDADES.map((unidade) => fetchCrowdForUnit(unidade))
    );

    for (const result of results) {
      await processCrowdResult(result, io);
    }

    console.log('[CrowdDaemon] --- Ciclo concluído ---');
  } catch (error) {
    console.error(
      '[CrowdDaemon] Erro inesperado durante ciclo de lotação:',
      error
    );
  } finally {
    cycleInProgress = false;
  }
};

const startCrowdMonitor = () => {
  if (monitorInterval) {
    console.warn(
      '[CrowdDaemon] Monitor já está ativo. Nova inicialização ignorada.'
    );
    return;
  }

  console.log(
    '[CrowdDaemon] Monitor iniciado. Consulta imediata + repetição a cada 60 segundos.'
  );

  runCrowdCycle();

  monitorInterval = setInterval(runCrowdCycle, 60000);
};

const stopCrowdMonitor = () => {
  if (!monitorInterval) return;

  clearInterval(monitorInterval);
  monitorInterval = null;

  console.log('[CrowdDaemon] Monitor interrompido.');
};

module.exports = {
  startCrowdMonitor,
  stopCrowdMonitor,
  runCrowdCycle,
};