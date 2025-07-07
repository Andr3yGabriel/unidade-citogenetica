import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('tipos_exame', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nome: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('tipos_exame');
  }
};
