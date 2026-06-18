require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const appRoutes = require('./routes/appRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: ['https://auth.dedalosbar.com', 'http://localhost:5173'],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/users', userRoutes);

app.use((err, req, res, next) => {
  console.error('[ERRO GLOBAL]', err.stack);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log(`[Ecrons Auth] API a correr na porta ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('Sinal SIGTERM recebido. A encerrar o servidor HTTP de forma graciosa...');
  server.close(() => {
    console.log('Servidor HTTP encerrado.');
    process.exit(0);
  });
});