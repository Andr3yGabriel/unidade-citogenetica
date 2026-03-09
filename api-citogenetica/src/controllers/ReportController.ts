import { Request, Response } from 'express';
import path from 'path';
import ReportRepository from '../repositories/ReportRepository';
import ExamRepository from '../repositories/ExamRepository';
import { ReportCreationAttributes } from '../models/Report';

class ReportController {
    static async uploadReport(req: Request, res: Response): Promise<void> {
        try {
            const { examId } = req.params;
            const file = req.file;

            if (!file) {
                res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                return;
            }

            const { path: filePath, originalname: fileName, mimetype: mimeType, size: fileSizeBytes } = file;

            const exam = await ExamRepository.findExamById(Number(examId));
            if (!exam) {
                res.status(404).json({ message: 'Exame não encontrado.' });
                return;
            }

            const newReportData: ReportCreationAttributes = {
                filePath,
                fileName,
                mimeType,
                fileSizeBytes,
                examId: Number(examId)
            };

            const [report, created] = await ReportRepository.findOrCreateReport(Number(examId), newReportData);

            if (!created) {
                await ReportRepository.updateReport(report, { filePath, fileName, mimeType, fileSizeBytes });
            }

            const finalStatus = await ExamRepository.findExamStatusByName('laudo_disponivel');
            if (finalStatus) {
                await ExamRepository.updateExam(exam, { examStatusId: finalStatus.id, conclusionDate: new Date() });
            }

            res.status(200).json({ message: 'Laudo enviado com sucesso!', report });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao enviar laudo.', error: error.message });
        }
    }

    static async updateReport(req: Request, res: Response): Promise<void> {
        try {
            const { reportId } = req.params;
            const { filePath, fileName, mimeType, fileSizeBytes } = req.body;
            if (!filePath || !fileName || !mimeType || !fileSizeBytes) {
                res.status(400).json({ message: 'Nenhum arquivo enviado.' });
                return;
            }

            const report = await ReportRepository.findReportById(Number(reportId));
            if (!report) {
                res.status(404).json({ message: 'Laudo não encontrado.' });
                return;
            }

            await ReportRepository.updateReport(report, { filePath, fileName, mimeType, fileSizeBytes });

            res.status(200).json({ message: 'Laudo atualizado com sucesso!', report });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao atualizar laudo.', error: error.message });
        }
    }

    static async getReportByExamId(req: Request, res: Response): Promise<void> {
        try {
            const { examId } = req.params;
            const report = await ReportRepository.findReportByExamId(Number(examId));

            if (!report) {
                res.status(404).json({ message: 'Laudo não encontrado.' });
                return;
            }

            res.status(200).json(report);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar laudo.', error: error.message });
        }
    }

    static async downloadReport(req: Request, res: Response): Promise<void> {
        try {
            const { examId } = req.params;
            const report = await ReportRepository.findReportByExamId(Number(examId));

            if (!report || !report.filePath) {
                res.status(404).json({ message: 'Laudo não encontrado.' });
                return;
            }

            const filePath = path.resolve(report.filePath);
            res.sendFile(filePath, (err) => {
                if (err) {
                    res.status(500).send('Não foi possível fazer o download do arquivo.');
                }
            });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao baixar o laudo.', error: error.message });
        }
    }
}

export default ReportController;
