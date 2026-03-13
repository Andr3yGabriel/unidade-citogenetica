import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tipos_exame', [
      { nome: 'Cariótipo' },
      { nome: 'Fish' },
      { nome: 'frágil' },
      { nome: 'MLPA' },
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tipos_exame', {}, {});
  }
};
