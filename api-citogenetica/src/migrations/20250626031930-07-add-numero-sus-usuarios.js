'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'numero_sus', {
      type: Sequelize.STRING(15),
      allowNull: true,
      unique: true
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'numero_sus');
  }
};