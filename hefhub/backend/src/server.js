require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { initSocket } = require('./utils/socket');
const { startPricesMonitor } = require('./utils/priceDaemon');

const priceRoutes = require('./routes/priceRoutes');

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use('/api/prices', priceRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Hefhub API is running', version: '2.0.0' });
});

const PORT = process.env.PORT || 4001;

server.listen(PORT, () => {
  console.log(`[Hefhub API] Gateway inicializado na porta ${PORT}`);
  startPricesMonitor();
});