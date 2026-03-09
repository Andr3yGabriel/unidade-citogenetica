import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nome_completo: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      documento: {
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
      },
      senha_hash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_tipo_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_usuario',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      token_reset_senha: {
        type: DataTypes.STRING,
        allowNull: true
      },
      expiracao_reset_senha: {
        type: DataTypes.DATE,
        allowNull: true
      },
      data_cadastro: {
        allowNull: false,
        type: DataTypes.DATE
      },
      data_atualizacao: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('usuarios');
  }
};
