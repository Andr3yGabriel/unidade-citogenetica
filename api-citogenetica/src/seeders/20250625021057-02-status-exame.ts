import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('status_exame', [
      { nome: 'solicitado' },
      { nome: 'aguardando_amostra' },
      { nome: 'em_analise' },
      { nome: 'laudo_disponivel' },
      { nome: 'cancelado' }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('status_exame', {}, {});
  }
};