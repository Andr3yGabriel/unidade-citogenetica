import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('usuarios', 'isActive', 'is_active');
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.renameColumn('usuarios', 'is_active', 'isActive');
  }
};
