const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.enforceCapacityLimit = async (unidade, quantidadeAberta) => {
  if (quantidadeAberta < 0) return 0;

  const totalVotosAtivos = await prisma.scoreboardVote.count({
    where: { unidade, status: 'DENTRO' }
  });

  const excesso = totalVotosAtivos - quantidadeAberta;

  if (excesso > 0) {
    const votosMaisAntigos = await prisma.scoreboardVote.findMany({
      where: { unidade, status: 'DENTRO' },
      orderBy: { created_at: 'asc' },
      take: excesso,
      select: { id: true }
    });

    const idsParaRemover = votosMaisAntigos.map(v => v.id);

    await prisma.scoreboardVote.updateMany({
      where: { id: { in: idsParaRemover } },
      data: { status: 'SAIU', updated_at: new Date() }
    });

    return excesso;
  }

  return 0;
};