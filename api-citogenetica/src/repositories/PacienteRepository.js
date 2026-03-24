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
   * Busca paciente por número SES (campo 'sesNumber' no banco)
   */
  async buscarPorNumeroSes(numeroSes) {
    return await User.findOne({
      where: { sesNumber: numeroSes }
    });
  }

  /**
   * Busca unificada: aceita CPF ou número SES no mesmo campo
   */
  async buscarPorCpfOuSes(termo) {
    const termoLimpo = termo.replace(/[.\-]/g, '');

    return await User.findOne({
      where: {
        [Op.or]: [
          { document: termoLimpo },
          { sesNumber: termoLimpo }
        ]
      }
    });
  }
}

module.exports = new PacienteRepository();
