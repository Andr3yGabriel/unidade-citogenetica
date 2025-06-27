'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tipos_exame', [
      { nome: 'sangue' },
      { nome: 'urina' },
      { nome: 'fezes' },
      { nome: 'secrecao' },
      { nome: 'outro' }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tipos_exame', null, {});
  }
};
