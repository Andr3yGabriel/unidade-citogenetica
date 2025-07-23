import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';

import db from './models';
import allRoutes from './routes/routes';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/files', express.static(path.join(__dirname, 'uploads')));

app.use('/api', allRoutes);

const startServer = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('-------------------------------------------------------');
      console.log(`🚀 Servidor iniciado e rodando na porta ${PORT}`);
      console.log(`      Acessível localmente em: http://localhost:${PORT}`);
      console.log(`      Uploads de laudos servidos em: http://localhost:${PORT}/files`);
      console.log('-------------------------------------------------------');
    });

  } catch (error: any) {
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
