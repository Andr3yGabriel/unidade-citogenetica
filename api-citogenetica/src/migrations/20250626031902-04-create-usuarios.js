'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome_completo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      documento: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
      },
      senha_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      id_tipo_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tipos_usuario',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      token_reset_senha: {
        type: Sequelize.STRING,
        allowNull: true
      },
      expiracao_reset_senha: {
        type: Sequelize.DATE,
        allowNull: true
      },
      data_cadastro: {
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
    await queryInterface.dropTable('usuarios');
  }
};
