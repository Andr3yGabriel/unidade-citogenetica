import db from '../models';
import { ReportAttributes, ReportCreationAttributes } from '../models/Report';

class ReportRepository {
    async findReportById(reportId: number): Promise<any> {
        const report = await db.Report.findByPk(reportId);
        return report;
    }

    async findOrCreateReport(examId: number, data: ReportCreationAttributes): Promise<[any, boolean]> {
        const [report, created] = await db.Report.findOrCreate({
            where: { examId: examId },
            defaults: data
        });
        return [report, created];
    }

    async updateReport(report: any, data: Partial<ReportAttributes>): Promise<any> {
        await report.update(data);
        return report;
    }

    async findReportByExamId(examId: number): Promise<any> {
        const report = await db.Report.findOne({ where: { examId } });
        return report;
    }
}

export default new ReportRepository();