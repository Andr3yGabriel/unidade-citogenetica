'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('laudos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_exame: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'exames', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      caminho_arquivo: {
        type: Sequelize.STRING(512),
        allowNull: false
      },
      nome_arquivo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      tipo_mime: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      tamanho_bytes: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      data_upload: {
        allowNull: false,
        type: Sequelize.DATE
      },
      data_atualizacao: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('laudos');
  }
};
