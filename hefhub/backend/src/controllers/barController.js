const dedalosService = require('../services/dedalosService');
const memoryCache = require('../utils/memoryCache');

const CACHE_TTL = 10; 

exports.getOcupacao = async (req, res) => {
  try {
    const { unidade_slug } = req.query;
    if (!unidade_slug) return res.status(400).json({ error: 'Parâmetro unidade_slug ausente.' });

    const cacheKey = `ocupacao:${unidade_slug}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) return res.status(200).json(cachedData);

    const data = await dedalosService.fetchOcupacao(unidade_slug);
    memoryCache.set(cacheKey, data, CACHE_TTL);

    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - OCUPAÇÃO]', error.response?.data || error.message);
    return res.status(502).json({ error: 'Falha ao consultar a ocupação.' });
  }
};

exports.getPrecosAtuais = async (req, res) => {
  try {
    const { unidade_slug } = req.query;
    if (!unidade_slug) return res.status(400).json({ error: 'Parâmetro unidade_slug ausente.' });

    const cacheKey = `precos:${unidade_slug}`;
    const cachedData = memoryCache.get(cacheKey);

    if (cachedData) return res.status(200).json(cachedData);

    const data = await dedalosService.fetchPrecosAtuais(unidade_slug);
    memoryCache.set(cacheKey, data, CACHE_TTL);

    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - PREÇOS]', error.response?.data || error.message);
    return res.status(502).json({ error: 'Falha ao consultar os preços.' });
  }
};

exports.getPulseira = async (req, res) => {
  try {
    const { unidade_slug, numero } = req.query;
    if (!unidade_slug || !numero) return res.status(400).json({ error: 'Parâmetros insuficientes.' });

    const data = await dedalosService.fetchPulseira(unidade_slug, numero);
    return res.status(200).json(data);
  } catch (error) {
    console.error('[ERRO API DÉDALOS - PULSEIRA]', error.response?.data || error.message);
    if (error.response?.status === 404) return res.status(404).json({ error: 'Pulseira não encontrada.' });
    return res.status(502).json({ error: 'Falha ao consultar a pulseira.' });
  }
};