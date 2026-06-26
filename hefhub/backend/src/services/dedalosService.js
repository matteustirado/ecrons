const axios = require('axios');

const dedalosApi = axios.create({
  baseURL: process.env.SITE_MAE_API_URL,
  timeout: 10000,
  headers: {
    'Authorization': `Bearer ${process.env.SITE_MAE_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

dedalosApi.interceptors.request.use((config) => {
  console.log(`[DÉDALOS API - REQUEST] ${config.method.toUpperCase()} ${config.baseURL || ''}${config.url}`, config.params || {});
  return config;
}, (error) => {
  console.error('[DÉDALOS API - REQUEST ERROR]', error.message);
  return Promise.reject(error);
});

dedalosApi.interceptors.response.use((response) => {
  console.log(`[DÉDALOS API - SUCCESS] ${response.config.url} | Status: ${response.status}`);
  return response;
}, (error) => {
  console.error(`[DÉDALOS API - FAILED] ${error.config?.url} | Status: ${error.response?.status} | Data:`, error.response?.data || error.message);
  return Promise.reject(error);
});

exports.fetchOcupacao = async (unidadeSlug) => {
  const response = await dedalosApi.get('/ocupacao/', {
    params: { unidade_slug: unidadeSlug }
  });
  return response.data;
};

exports.fetchPrecosAtuais = async (unidadeSlug) => {
  const response = await dedalosApi.get('/precos-atuais/', {
    params: { unidade_slug: unidadeSlug }
  });
  return response.data;
};

exports.fetchPulseira = async (unidadeSlug, numero) => {
  const response = await dedalosApi.get('/pulseira/', {
    params: { unidade_slug: unidadeSlug, numero }
  });
  return response.data;
};