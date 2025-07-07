import { Request, Response } from 'express';
import ExamRepository from '../repositories/ExamRepository';
import { ExamCreationAttributes } from '../models/Exam';

class ExamController {
    static async createExam(req: Request, res: Response): Promise<void> {
        try {
            const exameData = req.body;
            const initialStatus = await ExamRepository.findExamStatusByName('solicitado');
            if (!initialStatus) {
                res.status(500).json({ message: 'Status "solicitado" não configurado.' });
                return;
            }

            const newExamData: ExamCreationAttributes = {
                patientId: exameData.patientId,
                requestingDoctorId: exameData.requestingDoctorId,
                examTypeId: exameData.examTypeId,
                examStatusId: initialStatus.id,
                nomeExame: exameData.nomeExame || 'Exame Padrão',
            };

            const newExam = await ExamRepository.createExam(newExamData);
            res.status(201).json({ message: "Exame registrado com sucesso!", exam: newExam });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao registrar exame.', error: error.message });
        }
    }

    static async listDoctorExams(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId } = req.params;
            const exams = await ExamRepository.findAllExams({
                where: { requestingDoctorId: doctorId },
                include: ['patient', 'examType', 'examStatus']
            });

            res.status(200).json(exams);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar exames do médico.', error: error.message });
        }
    }

    static async listPatientExams(req: Request, res: Response): Promise<void> {
        try {
            const { patientId } = req.params;
            const exams = await ExamRepository.findAllExams({
                where: { patientId: patientId },
                include: ['patient', 'examType', 'examStatus']
            });
            res.status(200).json(exams);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar exames do paciente.', error: error.message });
        }
    }

    static async listAllExams(req: Request, res: Response): Promise<void> {
        try {
            const exams = await ExamRepository.findAllExams({
                include: ['patient', 'requestingDoctor', 'examType', 'examStatus'],
                order: [['data_solicitacao', 'DESC']]
            });
            res.status(200).json(exams);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar todos os exames.', error: error.message });
        }
    }
}

export default ExamController;
