require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { initSocket } = require('./utils/socket');
const { startPricesMonitor } = require('./utils/priceDaemon');
const { startCrowdMonitor } = require('./utils/crowdDaemon');

const priceRoutes = require('./routes/priceRoutes');
const authRoutes = require('./routes/authRoutes');
const scoreboardRoutes = require('./routes/scoreboardRoutes');

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/prices', priceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/scoreboard', scoreboardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Hefhub API is running', version: '2.0.0' });
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(`[Hefhub API] Gateway inicializado na porta ${PORT}`);
  startPricesMonitor();
  startCrowdMonitor();
});