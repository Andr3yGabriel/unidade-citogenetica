import { Sequelize, Dialect } from 'sequelize';
import 'dotenv/config';

// Validação básica das variáveis de ambiente
const requiredEnvVars: string[] = ['DB_DIALECT', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'NODE_ENV'];
for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`A variável de ambiente ${varName} é necessária e não foi definida.`);
    }
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
    host: process.env.DB_HOST!,
    dialect: process.env.DB_DIALECT as Dialect,

    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    timezone: 'America/Sao_Paulo',

    logging: process.env.NODE_ENV === 'dev' ? console.log : false,

    define: {
        freezeTableName: true,
        underscored: true,
        timestamps: true,
        createdAt: 'data_cadastro',
        updatedAt: 'data_atualizacao'
    },
});

async function testConnection(): Promise<void> {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso.');
    } catch (error) {
        console.error('❌ Não foi possível conectar ao banco de dados:', error);
    }
}

testConnection();

export default sequelize;