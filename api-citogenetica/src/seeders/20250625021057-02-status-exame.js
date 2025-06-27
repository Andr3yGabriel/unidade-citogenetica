'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('status_exame', [
      { nome: 'solicitado' },
      { nome: 'aguardando_amostra' },
      { nome: 'em_analise' },
      { nome: 'laudo_disponivel' },
      { nome: 'cancelado' }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('status_exame', null, {});
  }
};