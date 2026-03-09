import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tipos_exame', [
      { nome: 'sangue' },
      { nome: 'urina' },
      { nome: 'fezes' },
      { nome: 'secrecao' },
      { nome: 'outro' }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tipos_exame', {}, {});
  }
};
