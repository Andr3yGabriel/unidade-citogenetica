// src/controllers/PacienteBuscaController.js

const pacienteRepository = require('../repositories/PacienteRepository');

class PacienteBuscaController {
  /**
   * Busca unificada por CPF ou número SES
   * Médico: apenas pacientes que ele atendeu
   * Técnico: todos os pacientes
   */
  async buscar(req, res) {
    try {
      const { termo } = req.query;
      const { userId, userType } = req.user;

      if (!termo) {
        return res.status(400).json({
          erro: 'Parâmetro de busca não informado',
          mensagem: 'Informe um CPF ou número SES para buscar'
        });
      }

      const termoLimpo = termo.trim();

      if (termoLimpo.length < 11) {
        return res.status(400).json({
          erro: 'Termo de busca inválido',
          mensagem: 'CPF ou número SES deve ter no mínimo 11 caracteres'
        });
      }

      const paciente = await pacienteRepository.buscarPorCpfOuSus(termoLimpo);

      if (!paciente) {
        return res.status(404).json({
          erro: 'Paciente não encontrado',
          mensagem: 'Nenhum paciente foi encontrado com os dados informados'
        });
      }

      // Se for médico, verificar se o paciente tem exame solicitado por ele
      if (userType === 'medico') {
        const { Exam } = require('../models');
        const examExists = await Exam.findOne({
          where: {
            patientId: paciente.id,
            requestingDoctorId: userId
          }
        });

        if (!examExists) {
          return res.status(403).json({
            erro: 'Acesso negado',
            mensagem: 'Você só pode buscar pacientes que você atendeu'
          });
        }
      }

      const pacienteResponse = {
        id: paciente.id,
        completeName: paciente.completeName,
        email: paciente.email,
        document: paciente.document,
        sesNumber: paciente.sesNumber,
      };

      return res.status(200).json({
        sucesso: true,
        paciente: pacienteResponse
      });
    } catch (error) {
      console.error('Erro ao buscar paciente:', error);
      return res.status(500).json({
        erro: 'Erro interno do servidor',
        mensagem: 'Ocorreu um erro ao buscar o paciente'
      });
    }
  }

  async buscarPorCpf(req, res) {
    try {
      const { cpf } = req.params;

      if (!cpf) {
        return res.status(400).json({ erro: 'CPF não informado' });
      }

      const paciente = await pacienteRepository.buscarPorCpf(cpf);

      if (!paciente) {
        return res.status(404).json({
          erro: 'Paciente não encontrado',
          mensagem: 'Nenhum paciente foi encontrado com o CPF informado'
        });
      }

      return res.status(200).json({ sucesso: true, paciente });
    } catch (error) {
      console.error('Erro ao buscar paciente por CPF:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }

  async buscarPorNumeroSus(req, res) {
    try {
      const { numeroSus } = req.params;

      if (!numeroSus) {
        return res.status(400).json({ erro: 'Número SES não informado' });
      }

      const paciente = await pacienteRepository.buscarPorNumeroSus(numeroSus);

      if (!paciente) {
        return res.status(404).json({
          erro: 'Paciente não encontrado',
          mensagem: 'Nenhum paciente foi encontrado com o número SES informado'
        });
      }

      return res.status(200).json({ sucesso: true, paciente });
    } catch (error) {
      console.error('Erro ao buscar paciente por número SES:', error);
      return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
  }
}

module.exports = new PacienteBuscaController();