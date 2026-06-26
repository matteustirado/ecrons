const crowdStateByUnit = new Map();

const normalizeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const setCrowdState = (unidade, payload) => {
  if (!unidade) {
    throw new Error('[CrowdState] Unidade obrigatória para salvar estado.');
  }

  const normalizedUnit = String(unidade).toUpperCase();

  const state = {
    quantidade_aberta: Math.max(0, normalizeNumber(payload?.quantidade_aberta)),
    capacidadeMax: Math.max(1, normalizeNumber(payload?.capacidadeMax, 1)),
    atualizadoEm: payload?.atualizadoEm || new Date().toISOString(),
  };

  crowdStateByUnit.set(normalizedUnit, state);

  return state;
};

const getCrowdState = (unidade) => {
  if (!unidade) return null;

  const normalizedUnit = String(unidade).toUpperCase();

  return crowdStateByUnit.get(normalizedUnit) || null;
};

const getAllCrowdStates = () => {
  return Object.fromEntries(crowdStateByUnit.entries());
};

module.exports = {
  setCrowdState,
  getCrowdState,
  getAllCrowdStates,
};