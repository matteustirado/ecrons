const { PrismaClient } = require('@prisma/client');
const { getIO } = require('../utils/socket');
const { uploadBuffer } = require('../utils/s3Service');

const prisma = new PrismaClient();

const emitPricesUpdate = (unidade) => {
  try {
    getIO().emit('prices:updated', { unidade });
  } catch (error) {}
};

exports.getState = async (req, res) => {
  const unidade = req.params.unidade.toUpperCase();
  try {
    let state = await prisma.priceState.findUnique({ where: { unidade } });
    if (!state) {
      state = await prisma.priceState.create({ data: { unidade, valorAtual: 0 } });
    }
    return res.status(200).json(state);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar estado.' });
  }
};

exports.updateState = async (req, res) => {
  const unidade = req.params.unidade.toUpperCase();
  const data = req.body;
  try {
    const updated = await prisma.priceState.upsert({
      where: { unidade },
      update: data,
      create: { unidade, ...data }
    });
    emitPricesUpdate(unidade);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar estado.' });
  }
};

exports.getDefaults = async (req, res) => {
  const unidade = (req.query.unidade || 'SP').toUpperCase();
  try {
    const rows = await prisma.priceDefault.findMany({
      where: { unidade },
      orderBy: [{ tipoDia: 'desc' }, { periodo: 'asc' }, { qtdPessoas: 'asc' }]
    });
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar padrões.' });
  }
};

exports.updateDefault = async (req, res) => {
  const { id, valor } = req.body;
  try {
    const updated = await prisma.priceDefault.update({
      where: { id },
      data: { valor }
    });
    emitPricesUpdate(updated.unidade);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar padrão.' });
  }
};

exports.getCategoryMedia = async (req, res) => {
  const unidade = req.params.unidade.toUpperCase();
  try {
    const rows = await prisma.priceCategoryMedia.findMany({
      where: { unidade },
      orderBy: { qtdPessoas: 'asc' }
    });
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar mídias.' });
  }
};

exports.updateCategoryMedia = async (req, res) => {
  const { id, mediaUrl, titulo, avisoCategoria } = req.body;
  try {
    const data = {};
    if (mediaUrl !== undefined) data.mediaUrl = mediaUrl;
    if (titulo !== undefined) data.titulo = titulo;
    if (avisoCategoria !== undefined) data.avisoCategoria = avisoCategoria;

    const updated = await prisma.priceCategoryMedia.update({
      where: { id },
      data
    });
    emitPricesUpdate(updated.unidade);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar mídia.' });
  }
};

exports.getHolidays = async (req, res) => {
  const unidade = req.params.unidade.toUpperCase();
  try {
    const rows = await prisma.holiday.findMany({
      where: { unidade },
      orderBy: { dataFeriado: 'asc' }
    });
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar feriados.' });
  }
};

exports.addHoliday = async (req, res) => {
  const { unidade, nome, dataFeriado } = req.body;
  try {
    await prisma.holiday.create({ data: { unidade, nome, dataFeriado } });
    emitPricesUpdate(unidade);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao adicionar feriado.' });
  }
};

exports.deleteHoliday = async (req, res) => {
  const { id } = req.params;
  try {
    const holiday = await prisma.holiday.findUnique({ where: { id } });
    if (holiday) {
      await prisma.holiday.delete({ where: { id } });
      emitPricesUpdate(holiday.unidade);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao deletar feriado.' });
  }
};

exports.getPromotions = async (req, res) => {
  const unidade = req.params.unidade.toUpperCase();
  try {
    const rows = await prisma.promotion.findMany({
      where: { unidade },
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(rows);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar promoções.' });
  }
};

exports.addPromotion = async (req, res) => {
  const { unidade, promotions } = req.body;
  try {
    await prisma.promotion.deleteMany({ where: { unidade } });
    if (Array.isArray(promotions) && promotions.length > 0) {
      const payload = promotions.map(p => ({
        unidade,
        imageUrl: p.imageUrl,
        diasAtivos: JSON.stringify(p.diasAtivos)
      }));
      await prisma.promotion.createMany({ data: payload });
    }
    emitPricesUpdate(unidade);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao salvar promoções.' });
  }
};

exports.uploadPriceMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  try {
    const url = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype, 'prices');
    return res.status(200).json({ url });
  } catch (error) {
    return res.status(500).json({ error: 'Falha ao processar upload na nuvem.' });
  }
};