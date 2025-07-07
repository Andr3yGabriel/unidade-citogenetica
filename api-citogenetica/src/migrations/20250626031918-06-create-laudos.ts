import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('laudos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_exame: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'exames', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      caminho_arquivo: {
        type: DataTypes.STRING(512),
        allowNull: false
      },
      nome_arquivo: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipo_mime: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tamanho_bytes: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      data_upload: {
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
    await queryInterface.dropTable('laudos');
  }
};
