const { PrismaClient } = require('@prisma/client');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const s3Client = require('../utils/s3Client');

const prisma = new PrismaClient();

exports.getThemeByUrl = async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(200).json(null);
    }

    const apps = await prisma.app.findMany({
      where: { isActive: true },
      select: { name: true, description: true, url: true, logoUrl: true, color: true }
    });

    const matchedApp = apps
      .filter(a => a.url && url.startsWith(a.url))
      .sort((a, b) => b.url.length - a.url.length)[0];

    if (!matchedApp) {
      return res.status(200).json(null);
    }

    return res.status(200).json({
      name: matchedApp.name,
      description: matchedApp.description,
      logoUrl: matchedApp.logoUrl,
      color: matchedApp.color
    });
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao processar tema dinâmico.' });
  }
};

exports.getAllApps = async (req, res) => {
  try {
    const apps = await prisma.app.findMany({
      orderBy: { createdAt: 'asc' }
    });
    return res.status(200).json(apps);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao carregar aplicativos.' });
  }
};

exports.createApp = async (req, res) => {
  try {
    const { name, description, url, color, status } = req.body;

    const existingApp = await prisma.app.findUnique({ where: { name } });
    if (existingApp) {
      return res.status(400).json({ error: 'Este aplicativo já está registado.' });
    }

    let logoUrl = null;

    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        })
      );

      logoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileName}`;
    }

    const newApp = await prisma.app.create({
      data: {
        name,
        description,
        url,
        color: color || 'slate',
        status: status || 'DEVELOPMENT',
        logoUrl
      }
    });

    return res.status(201).json(newApp);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao criar aplicativo.' });
  }
};

exports.updateApp = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, url, color, status } = req.body;

    const updateData = { name, description, url, color, status };

    if (req.file) {
      const fileExtension = req.file.originalname.split('.').pop();
      const fileName = `${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: fileName,
          Body: req.file.buffer,
          ContentType: req.file.mimetype
        })
      );

      updateData.logoUrl = `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${fileName}`;
    }

    const updatedApp = await prisma.app.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updatedApp);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao atualizar aplicativo.' });
  }
};

exports.toggleAppStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const updatedApp = await prisma.app.update({
      where: { id },
      data: { isActive }
    });
    
    return res.status(200).json(updatedApp);
  } catch (error) {
    console.error('[ERRO API]', error);
    return res.status(500).json({ error: 'Erro ao alterar status do aplicativo.' });
  }
};