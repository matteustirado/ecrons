const axios = require('axios');

const dedalosApi = axios.create({
  baseURL: process.env.SITE_MAE_API_URL,
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${process.env.SITE_MAE_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

exports.fetchOcupacao = async (unidadeSlug) => {
  const response = await dedalosApi.get(`/ocupacao/?unidade_slug=${unidadeSlug}`);
  return response.data;
};

exports.fetchPrecosAtuais = async (unidadeSlug) => {
  const response = await dedalosApi.get(`/precos-atuais/?unidade_slug=${unidadeSlug}`);
  return response.data;
};

exports.fetchPulseira = async (unidadeSlug, numero) => {
  const response = await dedalosApi.get(`/pulseira/?unidade_slug=${unidadeSlug}&numero=${numero}`);
  return response.data;
};