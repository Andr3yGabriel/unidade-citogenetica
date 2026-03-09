const { Op } = require('sequelize');
const User = require('../models/User');

class PacienteRepository {
  /**
   * Busca paciente por CPF (campo 'document' no banco)
   */
  async buscarPorCpf(cpf) {
    const cpfLimpo = cpf.replace(/[.\-]/g, '');
    return await User.findOne({
      where: { document: cpfLimpo }
    });
  }

  /**
   * Busca paciente por número SUS (campo 'susNumber' no banco)
   */
  async buscarPorNumeroSus(numeroSus) {
    return await User.findOne({
      where: { susNumber: numeroSus }
    });
  }

  /**
   * Busca unificada: aceita CPF ou número SUS no mesmo campo
   */
  async buscarPorCpfOuSus(termo) {
    const termoLimpo = termo.replace(/[.\-]/g, '');

    return await User.findOne({
      where: {
        [Op.or]: [
          { document: termoLimpo },
          { susNumber: termoLimpo }
        ]
      }
    });
  }
}

module.exports = new PacienteRepository();
