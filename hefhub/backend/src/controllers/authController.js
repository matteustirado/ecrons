const axios = require('axios');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

exports.exchangeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Código de autorização ausente.' });
    }

    const exchangeResponse = await axios.post(`${process.env.ECRONS_API_URL}/auth/exchange`, { code });
    const { accessToken } = exchangeResponse.data;

    const verifyResponse = await axios.get(`${process.env.ECRONS_API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const ecronsUser = verifyResponse.data.user;

    if (!ecronsUser.isActive) {
      return res.status(403).json({ error: 'Usuário inativo no Ecrons.' });
    }

    const localUser = await prisma.user.upsert({
      where: { id: ecronsUser.id },
      update: { 
        username: ecronsUser.username, 
        role: ecronsUser.role, 
        isActive: ecronsUser.isActive 
      },
      create: { 
        id: ecronsUser.id, 
        username: ecronsUser.username, 
        role: ecronsUser.role, 
        isActive: ecronsUser.isActive 
      }
    });

    return res.status(200).json({ 
      accessToken, 
      user: localUser 
    });

  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 403) {
      return res.status(401).json({ error: 'Código de troca expirado ou inválido.' });
    }

    return res.status(500).json({ error: 'Falha na comunicação com o provedor de identidade.' });
  }
};