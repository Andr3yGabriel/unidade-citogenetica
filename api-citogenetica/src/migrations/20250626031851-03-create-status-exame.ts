import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('status_exame', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nome: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('status_exame');
  }
};
