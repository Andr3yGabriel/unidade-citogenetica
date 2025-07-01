const db = require('../models'); // Usando o objeto db para acesso fácil
const { ExameService } = require('../services/ExamesService'); // Importando o serviço de exames

class ExamController {
    /**
     * Cria um novo exame. Apenas para Técnicos e Admins.
     */
    static async createExam(req, res) {

    
        ExameService.createExam(mapperRequestCreateExame(req.body));


    }

    static mapperRequestCreateExame(data) {
        return {
            patientId: data.patientId,
            requestingDoctorId: data.requestingDoctorId,
            examTypeId: data.examTypeId,
            examStatusId: data.examStatusId || 1,
            nomeExame: data.nomeExame || 'Exame Padrão',
        };
    }

    /**
     * Lista exames solicitados pelo médico logado.
     */
    static async listDoctorExams(req, res) {
        try {
            const { doctorId } = req.params;
            const exams = await db.Exam.findAll({
                where: { requestingDoctorId: doctorId },
                include: ['patient', 'examType', 'examStatus'] // Usando os 'as' definidos no models/index.js
            });

            ExameService.createExam(exams);
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar exames do médico.', error: error.message });
        }
    }

    /**
     * Lista exames do paciente logado.
     */
    static async listPatientExams(req, res) {
        try {
            const { patientId } = req.params;
            const exams = await db.Exam.findAll({
                where: { patientId: patientId },
                include: ['patient', 'examType', 'examStatus']
            });
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar exames do paciente.', error: error.message });
        }
    }

    /**
     * Lista todos os exames do sistema. Para Técnicos e Admins.
     */
    static async listAllExams(req, res) {
        try {
            const exams = await db.Exam.findAll({
                include: ['patient', 'requestingDoctor', 'examType', 'examStatus'],
                order: [['data_solicitacao', 'DESC']]
            });
            res.status(200).json(exams);
        } catch (error) {
            res.status(500).json({ message: 'Erro ao listar todos os exames.', error: error.message });
        }
    }
}

module.exports = ExamController;
