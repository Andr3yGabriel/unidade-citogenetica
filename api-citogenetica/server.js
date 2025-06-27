// Carrega as variáveis de ambiente do arquivo .env no início de tudo.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// --- PONTO 1: IMPORTAÇÃO CENTRALIZADA ---
// Importamos o objeto 'db' que contém a instância do sequelize e todos os modelos.
// A conexão com o banco de dados já é testada dentro deste módulo.
const db = require('./src/models');

// Importamos o arquivo de rotas consolidado.
const allRoutes = require('./src/routes/routes');

const app = express();
const PORT = process.env.PORT || 3000; // Define uma porta padrão.

// --- MIDDLEWARES ---

// Habilita o CORS para todas as origens.
app.use(cors());

// Configura o parser para payloads JSON. Reduzimos o limite, pois não trafegamos mais arquivos em Base64.
app.use(express.json({ limit: '1mb' }));

// Parser para dados de formulário url-encoded.
app.use(express.urlencoded({ extended: true }));


// --- PONTO 2: SERVINDO ARQUIVOS ESTÁTICOS (LAUDOS) ---
// Esta linha instrui o Express a servir os arquivos da pasta 'uploads'
// através de uma rota virtual chamada '/files'.
// Exemplo de URL: http://localhost:3000/files/nome_do_laudo.pdf
app.use('/files', express.static(path.join(__dirname, 'uploads')));

// --- PONTO 3: INICIALIZAÇÃO DO BANCO DE DADOS ---
// Testa a conexão com o banco de dados e sincroniza os modelos.
// A conexão é feita uma única vez aqui, no início do servidor.
app.set('db', db);

// --- ROTAS DA API ---
// Centraliza todas as rotas da aplicação sob o prefixo /api.
app.use('/api', allRoutes);


// --- INICIALIZAÇÃO DO SERVIDOR ---

const startServer = async () => {
  try {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('-------------------------------------------------------');
      console.log(`🚀 Servidor iniciado e rodando na porta ${PORT}`);
      console.log(`      Acessível localmente em: http://localhost:${PORT}`);
      console.log(`      Uploads de laudos servidos em: http://localhost:${PORT}/files`);
      console.log('-------------------------------------------------------');
    });

  } catch (error) {
    // Captura erros críticos que podem ocorrer durante a configuração inicial.
    console.error('❌ Erro fatal ao iniciar o servidor:', error);
    process.exit(1); // Encerra o processo em caso de erro crítico.
  }
};

// Inicia o servidor.
startServer();
