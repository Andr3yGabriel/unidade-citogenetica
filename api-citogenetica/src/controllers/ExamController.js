const db = require('../models'); // Usando o objeto db para acesso fácil

class ExamController {
    static async createExam(req, res) {
        try {
            const { patientId, requestingDoctorId, examTypeId } = req.body;

            const newExam = await db.Exam.create({
                patientId,
                requestingDoctorId,
                examTypeId,
                examStatusId: 1, // Status inicial (ex: "Em Análise")
            });

            res.status(201).json({
                message: 'Exame criado com sucesso!',
                exam: newExam
            });
        } catch (error) {
            console.error('Erro ao criar exame:', error);
            res.status(500).json({
                message: 'Erro ao criar exame',
                error: error.message
            });
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
                include: ['patient', 'examType', 'examStatus']
            });
            
            res.status(200).json(exams);
        } catch (error) {
            console.error('Erro ao listar exames do médico:', error);
            res.status(500).json({ 
                message: 'Erro ao listar exames do médico.', 
                error: error.message 
            });
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
            console.error('Erro ao listar exames do paciente:', error);
            res.status(500).json({ 
                message: 'Erro ao listar exames do paciente.', 
                error: error.message 
            });
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
            console.error('Erro ao listar todos os exames:', error);
            res.status(500).json({ 
                message: 'Erro ao listar todos os exames.', 
                error: error.message 
            });
        }
    }

    /**
     * Lista todos os tipos de exame disponíveis
     */
    static async listExamTypes(req, res) {
        try {
            const examTypes = await db.ExamType.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']]
            });
            res.status(200).json(examTypes);
        } catch (error) {
            console.error('Erro ao listar tipos de exame:', error);
            res.status(500).json({ 
                message: 'Erro ao listar tipos de exame.', 
                error: error.message 
            });
        }
    }
}

module.exports = ExamController;