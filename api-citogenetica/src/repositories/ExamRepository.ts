import db from '../models';
import { ExamAttributes, ExamCreationAttributes } from '../models/Exam';

class ExamRepository {
    async createExam(data: ExamCreationAttributes): Promise<any> {
        const newExam = await db.Exam.create(data);
        return newExam;
    }

    async findExamStatusByName(name: string): Promise<any> {
        const status = await db.ExamStatus.findOne({ where: { name } });
        return status;
    }

    async findAllExams(queryOptions?: object): Promise<any[]> {
        const exams = await db.Exam.findAll(queryOptions);
        return exams;
    }

    async findExamById(id: number): Promise<any> {
        const exam = await db.Exam.findByPk(id);
        return exam;
    }

    async updateExam(exam: any, data: Partial<ExamAttributes>): Promise<any> {
        await exam.update(data);
        return exam;
    }
}

export default new ExamRepository();