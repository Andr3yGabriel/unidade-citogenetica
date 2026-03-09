import { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkInsert('tipos_usuario', [
      { nome: 'admin', descricao: 'Gerencia o sistema e os usuários.' },
      { nome: 'tecnico', descricao: 'Processa exames e gera laudos.' },
      { nome: 'medico', descricao: 'Solicita exames para pacientes.' },
      { nome: 'paciente', descricao: 'Visualiza seus próprios exames.' }
    ], {});
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.bulkDelete('tipos_usuario', {}, {});
  }
};