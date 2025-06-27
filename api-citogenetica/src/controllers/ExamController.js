const db = require('../models'); // Usando o objeto db para acesso fácil

class ExamController {
    /**
     * Cria um novo exame. Apenas para Técnicos e Admins.
     */
    static async createExam(req, res) {
        try {
            const { patientId, requestingDoctorId, examTypeId } = req.body;
            const initialStatus = await db.ExamStatus.findOne({ where: { name: 'solicitado' } });
            if (!initialStatus) return res.status(500).json({ message: 'Status "solicitado" não configurado.' });

            const newExam = await db.Exam.create({
                patientId,
                requestingDoctorId,
                examTypeId,
                examStatusId: initialStatus.id
            });
            res.status(201).json({ message: "Exame registrado com sucesso!", exam: newExam });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar exame.', error: error.message });
        }
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
