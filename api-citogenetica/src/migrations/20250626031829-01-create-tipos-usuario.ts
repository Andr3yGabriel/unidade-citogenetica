import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('tipos_usuario', {
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
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('tipos_usuario');
  }
};