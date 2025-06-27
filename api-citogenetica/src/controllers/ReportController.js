const db = require('../models');

class ReportController {
    /**
     * Faz o upload de um laudo para um exame. Somente para Técnicos.
     * Assume que um middleware (ex: multer) já processou o arquivo.
     */
    static async uploadReport(req, res) {
        try {
            const { examId } = req.params;
            const { filePath, fileName, mimeType, fileSizeBytes } = req.body;
            if (!filePath || !fileName || !mimeType || !fileSizeBytes) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
            }

            const exam = await db.Exam.findByPk(examId);
            if (!exam) return res.status(404).json({ message: 'Exame não encontrado.' });

            // Cria ou atualiza o laudo
            const [report, created] = await db.Report.findOrCreate({
                where: { examId: exam.id },
                defaults: {
                    filePath,
                    fileName,
                    mimeType,
                    fileSizeBytes
                }
            });

            if (!created) {
                // Se já existia, atualiza os dados
                report.filePath = filePath;
                report.fileName = fileName;
                report.mimeType = mimeType;
                report.fileSizeBytes = fileSizeBytes;
                await report.save();
            }

            // Atualiza status do exame para 'Laudo Disponível'
            const finalStatus = await db.ExamStatus.findOne({ where: { name: 'Laudo Disponível' } });
            if (finalStatus) {
                exam.examStatusId = finalStatus.id;
                exam.conclusionDate = new Date();
                await exam.save();
            }

            res.status(200).json({ message: 'Laudo enviado com sucesso!', report });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao enviar laudo.', error: error.message });
        }
    }

    /**
     * Atualiza um laudo existente (por exemplo, para reenviar um arquivo corrigido).
     */
    static async updateReport(req, res) {
        try {
            const { reportId } = req.params;
            const { filePath, fileName, mimeType, fileSizeBytes } = req.body;
            if (!filePath || !fileName || !mimeType || !fileSizeBytes) {
                return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
            }

            const report = await db.Report.findByPk(reportId);
            if (!report) return res.status(404).json({ message: 'Laudo não encontrado.' });

            report.filePath = filePath;
            report.fileName = fileName;
            report.mimeType = mimeType;
            report.fileSizeBytes = fileSizeBytes;
            await report.save();

            res.status(200).json({ message: 'Laudo atualizado com sucesso!', report });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar laudo.', error: error.message });
        }
    }
}

module.exports = ReportController;
