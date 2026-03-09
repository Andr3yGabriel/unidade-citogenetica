import { Op, QueryInterface, Transaction } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // Inicia uma transação para garantir a integridade dos dados
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      // Array com os dados que queremos atualizar
      const statuses = [
        { nome: 'solicitado', title: 'Exame Solicitado' },
        { nome: 'aguardando_amostra', title: 'Aguardando Amostra' },
        { nome: 'em_analise', title: 'Em Análise' },
        { nome: 'laudo_disponivel', title: 'Laudo Disponível' },
        { nome: 'cancelado', title: 'Exame Cancelado' }
      ];

      // Mapeia cada status para uma promessa de atualização
      const updatePromises = statuses.map(status =>
        queryInterface.bulkUpdate(
          'status_exame', // Nome da tabela
          { title: status.title }, // O valor a ser atualizado
          { nome: status.nome }, // Onde a atualização deve ocorrer (cláusula WHERE)
          { transaction } // Garante que a operação ocorra dentro da transação
        )
      );

      // Executa todas as promessas de atualização
      await Promise.all(updatePromises);

      // Se tudo deu certo, "commita" a transação
      await transaction.commit();
    } catch (error) {
      // Se algo deu errado, desfaz todas as alterações
      await transaction.rollback();
      console.error('Erro ao atualizar os títulos dos status:', error);
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    // A operação 'down' pode reverter o 'title' para NULL ou para um valor anterior.
    // Reverter para NULL é geralmente a abordagem mais simples.
    const transaction: Transaction = await queryInterface.sequelize.transaction();
    try {
      const nomes = [
        'solicitado',
        'aguardando_amostra',
        'em_analise',
        'laudo_disponivel',
        'cancelado'
      ];

      await queryInterface.bulkUpdate(
        'status_exame',
        { title: null }, // Define o title como nulo
        { nome: { [Op.in]: nomes } }, // Para todos os nomes listados
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.error('Erro ao reverter os títulos dos status:', error);
      throw error;
    }
  }
};