import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    if (process.env.NODE_ENV !== 'dev') {
      console.log('Seed de Admin não será executado em ambiente de produção ou teste.');
      return;
    }

    const [userTypes] = await queryInterface.sequelize.query(
      `SELECT id FROM tipos_usuario WHERE nome = 'admin';`
    ) as unknown as [{ id: number }[], unknown];
    const adminTypeId = userTypes[0]?.id;

    if (!adminTypeId) {
      throw new Error('Tipo de usuário "admin" não encontrado. Rode o seed de tipos_usuario primeiro.');
    }

    const hashedPassword = await bcrypt.hash('123', 10);

    await queryInterface.bulkInsert('usuarios', [{
      nome_completo: 'Administrador Padrão',
      email: 'admin@hospital.br',
      documento: '12345678900',
      senha_hash: hashedPassword,
      id_tipo_usuario: adminTypeId,
      data_cadastro: new Date(),
      data_atualizacao: new Date()
    }], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('usuarios', { email: 'admin@hospital.br' }, {});
  }
};