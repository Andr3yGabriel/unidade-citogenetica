import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn('status_exame', 'title', {
      type: DataTypes.STRING
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('status_exame', 'title');
  }
};
