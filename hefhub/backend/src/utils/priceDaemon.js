const { PrismaClient } = require('@prisma/client');
const dedalosService = require('../services/dedalosService');
const { getIO } = require('./socket');

const prisma = new PrismaClient();
const UNIDADES = ['SP', 'BH', 'RJ'];

const getSlug = (unidade) => {
  const map = { SP: 'sao-paulo', BH: 'belo-horizonte', RJ: 'rio-de-janeiro' };
  return map[unidade] || null;
};

const runPriceMonitor = async () => {
  let io;
  try {
    io = getIO();
  } catch {
    return;
  }

  for (const unidade of UNIDADES) {
    try {
      const slug = getSlug(unidade);
      if (!slug) continue;

      let externalPrice = null;
      
      try {
        const response = await dedalosService.fetchPrecosAtuais(slug);
        if (response && Array.isArray(response.precos)) {
          const basePrice = response.precos.find(p => p.codigo === '1_player' && p.disponivel);
          if (basePrice && basePrice.valor) {
            externalPrice = parseFloat(basePrice.valor);
          }
        }
      } catch (error) {
        continue;
      }

      if (externalPrice !== null) {
        const currentState = await prisma.priceState.findUnique({ where: { unidade } });
        
        if (!currentState || currentState.valorAtual !== externalPrice) {
          await prisma.priceState.upsert({
            where: { unidade },
            update: { valorAtual: externalPrice },
            create: { unidade, valorAtual: externalPrice }
          });

          io.emit('prices:updated', { unidade });
        }
      }
    } catch (error) {}
  }
};

exports.startPricesMonitor = () => {
  setInterval(runPriceMonitor, 30000);
};