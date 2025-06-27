// config/Database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Validação básica das variáveis de ambiente
const requiredEnvVars = ['DB_DIALECT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'NODE_ENV'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`A variável de ambiente ${varName} é necessária e não foi definida.`);
    }
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT, // Deve ser 'postgres'

    // 1. Configuração de Pool de Conexões para performance e estabilidade
    pool: {
        max: 10, // Máximo de conexões no pool
        min: 0,  // Mínimo de conexões no pool
        acquire: 30000, // Tempo máximo (ms) para tentar obter uma conexão antes de gerar erro
        idle: 10000 // Tempo máximo (ms) que uma conexão pode ficar ociosa antes de ser liberada
    },

    // 2. Configuração de Timezone correta para PostgreSQL
    // Use o nome da IANA Time Zone. O PostgreSQL irá converter e armazenar em UTC (TIMESTAMPTZ)
    // e retornar no fuso horário correto na consulta.
    timezone: 'America/Sao_Paulo',

    // 3. Controle de Logging
    // Loga o SQL no console apenas em ambiente de desenvolvimento
    logging: process.env.NODE_ENV === 'dev' ? console.log : false,

    // 4. Definições globais para todos os modelos
    define: {
        // Força os nomes das tabelas a não serem pluralizados pelo Sequelize
        freezeTableName: true,

        // Converte nomes de campos camelCase (no JS) para snake_case (no DB) automaticamente
        // Ex: `patientId` no modelo se torna `patient_id` na tabela.
        underscored: true,

        // Define globalmente que queremos usar os timestamps gerenciados pelo Sequelize
        timestamps: true,
        createdAt: 'data_cadastro',
        updatedAt: 'data_atualizacao'
    },

    // 5. REMOVIDO: dialectOptions com typeCast não é necessário para PostgreSQL
    // O driver 'pg' do Node.js já lida com a conversão de tipos de data corretamente
    // quando o tipo da coluna é TIMESTAMPTZ (o padrão do Sequelize para DataTypes.DATE).
});

// Testar a conexão
async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

module.exports = sequelize;