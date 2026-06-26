const dedalosService = require('../services/dedalosService');
const memoryCache = require('../utils/memoryCache');

const CACHE_TTL = 10;

const parseUnidadeSlug = (unidade) => {
  const parsed = String(unidade).toLowerCase().trim();
  const map = {
    sp: 'sao-paulo',
    'sao-paulo': 'sao-paulo',
    rj: 'rio-de-janeiro',
    'rio-de-janeiro': 'rio-de-janeiro',
    bh: 'belo-horizonte',
    'belo-horizonte': 'belo-horizonte'
  };
  return map[parsed] || parsed;
};

exports.getOcupacao = async (req, res) => {
  try {
    const rawUnidade = req.query.unidade_slug || req.query.unidade;
    if (!rawUnidade) return res.status(400).json({ error: 'Parâmetro de unidade ausente.' });

    const unidadeSlug = parseUnidadeSlug(rawUnidade);
    const cacheKey = `ocupacao:${unidadeSlug}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) return res.status(200).json(cachedData);

    const data = await dedalosService.fetchOcupacao(unidadeSlug);
    memoryCache.set(cacheKey, data, CACHE_TTL);

    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - OCUPAÇÃO]', error.response?.data || error.message);
    return res.status(502).json({ error: 'Falha ao consultar a ocupação.' });
  }
};

exports.getPrecosAtuais = async (req, res) => {
  try {
    const rawUnidade = req.query.unidade_slug || req.query.unidade;
    if (!rawUnidade) return res.status(400).json({ error: 'Parâmetro de unidade ausente.' });

    const unidadeSlug = parseUnidadeSlug(rawUnidade);
    const cacheKey = `precos:${unidadeSlug}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) return res.status(200).json(cachedData);

    const data = await dedalosService.fetchPrecosAtuais(unidadeSlug);
    memoryCache.set(cacheKey, data, CACHE_TTL);

    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - PREÇOS]', error.response?.data || error.message);
    return res.status(502).json({ error: 'Falha ao consultar os preços.' });
  }
};

exports.getPulseira = async (req, res) => {
  try {
    const rawUnidade = req.query.unidade_slug || req.query.unidade;
    const { numero } = req.query;
    
    if (!rawUnidade || !numero) return res.status(400).json({ error: 'Parâmetros insuficientes.' });

    const unidadeSlug = parseUnidadeSlug(rawUnidade);
    const data = await dedalosService.fetchPulseira(unidadeSlug, numero);
    
    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - PULSEIRA]', error.response?.data || error.message);
    if (error.response?.status === 404) return res.status(404).json({ error: 'Pulseira não encontrada.' });
    return res.status(502).json({ error: 'Falha ao consultar a pulseira.' });
  }
};