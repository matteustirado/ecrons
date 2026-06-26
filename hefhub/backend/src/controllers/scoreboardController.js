const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getIO } = require('../utils/socket');
const scoreboardService = require('../services/scoreboardService');
const { uploadBuffer } = require('../utils/s3Service');

exports.getActiveConfig = async (req, res) => {
  try {
    const { unidade } = req.params;
    
    if (!unidade) return res.status(400).json({ error: 'Unidade é obrigatória.' });

    const config = await prisma.scoreboardConfig.findUnique({
      where: { unidade }
    });

    if (!config) {
      return res.status(200).json({ titulo: '', layout: 'landscape', capacidadeMax: 230, opcoes: [] });
    }

    return res.status(200).json(config);
  } catch (error) {
    console.error('[getActiveConfig] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveActiveConfig = async (req, res) => {
  try {
    const { unidade, titulo, layout, opcoes, status, capacidadeMax } = req.body;

    if (!unidade) {
      return res.status(400).json({ error: 'Unidade é obrigatória para salvar o placar.' });
    }

    const isActive = status === 'ATIVO';
    const capMax = capacidadeMax ? parseInt(capacidadeMax, 10) : 230;

    const config = await prisma.scoreboardConfig.upsert({
      where: { unidade },
      update: { titulo, layout, isActive, capacidadeMax: capMax, opcoes },
      create: { unidade, titulo, layout, isActive, capacidadeMax: capMax, opcoes }
    });

    const io = getIO();
    if (io) {
      io.to(`unidade_${unidade}`).emit('scoreboard:update', config);
    }

    return res.status(200).json(config);
  } catch (error) {
    console.error('[saveActiveConfig] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getPresets = async (req, res) => {
  try {
    const { unidade } = req.params;
    
    if (!unidade) return res.status(400).json({ error: 'Unidade é obrigatória.' });

    const presets = await prisma.scoreboardPreset.findMany({
      where: { unidade },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(presets);
  } catch (error) {
    console.error('[getPresets] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.savePreset = async (req, res) => {
  try {
    const { unidade, titulo_preset, titulo_placar, layout, opcoes } = req.body;

    if (!unidade) return res.status(400).json({ error: 'Unidade é obrigatória.' });

    const preset = await prisma.scoreboardPreset.create({
      data: { unidade, titulo_preset, titulo_placar, layout, opcoes }
    });

    return res.status(201).json(preset);
  } catch (error) {
    console.error('[savePreset] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deletePreset = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.scoreboardPreset.delete({
      where: { id }
    });

    return res.status(200).json({ message: 'Preset deleted successfully' });
  } catch (error) {
    console.error('[deletePreset] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { unidade } = req.params;
    const { month, year } = req.query;

    if (!unidade) return res.status(400).json({ error: 'Unidade é obrigatória.' });
    if (!month || !year) return res.status(400).json({ error: 'Month and year are required' });

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    const history = await prisma.scoreboardVote.findMany({
      where: {
        unidade,
        created_at: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: { created_at: 'desc' }
    });

    return res.status(200).json(history);
  } catch (error) {
    console.error('[getHistory] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  try {
    const url = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype, 'scoreboard');
    
    return res.status(200).json({ url });
  } catch (error) {
    console.error('[uploadImage] Erro no upload para a nuvem:', error);
    return res.status(500).json({ error: 'Falha ao processar upload na nuvem.' });
  }
};

exports.castVote = async (req, res) => {
  try {
    const { unidade, optionIndex, cliente_id, quantidade_aberta } = req.body;

    if (!unidade || optionIndex === undefined) {
      return res.status(400).json({ error: 'Dados de voto inválidos.' });
    }

    const isTeste = !cliente_id || cliente_id.startsWith('TESTE') || cliente_id === 'VOTO-BALCAO';

    await prisma.scoreboardVote.create({
      data: {
        unidade,
        cliente_id: cliente_id || `TESTE-${Date.now()}`,
        option_index: optionIndex,
        status: 'DENTRO',
        expires_at: isTeste ? new Date(Date.now() + 30 * 60000) : null 
      }
    });

    if (quantidade_aberta !== undefined) {
      await scoreboardService.enforceCapacityLimit(unidade, quantidade_aberta);
    }

    const currentVotes = await prisma.scoreboardVote.groupBy({
      by: ['option_index'],
      where: { unidade, status: 'DENTRO' },
      _count: { option_index: true }
    });

    const io = getIO();
    if (io) {
      io.to(`unidade_${unidade}`).emit('game_vote_cast', { currentVotes });
    }

    return res.status(201).json({ message: 'Voto computado e sincronizado.' });
  } catch (error) {
    console.error('[castVote] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getVotes = async (req, res) => {
  try {
    const { unidade } = req.params;
    
    if (!unidade) return res.status(400).json({ error: 'Unidade é obrigatória.' });

    const currentVotes = await prisma.scoreboardVote.groupBy({
      by: ['option_index'],
      where: { unidade, status: 'DENTRO' },
      _count: { option_index: true }
    });

    return res.status(200).json(currentVotes);
  } catch (error) {
    console.error('[getVotes] Erro:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};