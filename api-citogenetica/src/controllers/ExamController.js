const Exam = require("../models/Exam.js");

class ExamController {
    static async ListExamsByDoctorDocument(req, res) {
        try {
            const exams = await Exam.findAll({
                where: { doctorDocument: req.user.document },
                attributes: ['id', 'patientDocument', 'registrationDate', 'resultFile']
            });

            res.status(200).json(exams);
        } catch (error) {
            console.error("Error at list Doctor exams: ", error);
            res.status(500).json({ message: 'Unexpected error while listing Doctor exams!', error });
        }
    }

    static async ListAllExams(req, res) {
        try {
            const exams = await Exam.findAll({
                attributes: ['id', 'patientDocument', 'registrationDate', 'resultFile']
            });

            res.status(200).json(exams);
        } catch (error) {
            console.error("Error at list Doctor exams: ", error);
            res.status(500).json({ message: 'Unexpected error while listing Doctor exams!', error });
        }
    }

    static async GetExamsByPatientDocument(req, res) {
        try {
            const exams = await Exam.findAll({
                where: { patientDocument: req.user.document },
                attributes: ['id', 'patientDocument', 'registrationDate', 'resultFile']
            });

            res.status(200).json(exams);
        } catch (error) {
            console.error("Error at list Doctor exams: ", error);
            res.status(500).json({ message: 'Unexpected error while listing Doctor exams!', error });
        }
    }

    static async AddExam(req, res) {
        try {
            const { type, subtype, doctorDocument, patientDocument } = req.body;

            if (!type || !subtype || !doctorDocument || !patientDocument) {
                return res.status(400).json({ message: 'Todas as informações são necessárias' });
            }

            const newExam = await Exam.create({ type, subtype, doctorDocument, patientDocument });

            res.status(201).json({ message: "Exame registrado com sucesso!", exam: newExam });
        } catch (error) {
            console.error("Erro ao adicionar exame: ", error);
            res.status(500).json({ message: 'Erro inesperado ao adicionar exame!', error });
        }
    }

    static async AddExamFile(req, res) {
        try {
            const { id, file, exam_date, type, subtype } = req.body;
            const exam = await Exam.findOne({ where: { id } });

            if (exam) {
                exam.resultFile = file;
                exam.registrationDate = exam_date;
                exam.type = type;
                await exam.save();
                res.status(200).json({ message: 'Resultado adicionado ao exame com sucesso!' });
            }
        } catch (error) {
            console.error("Erro ao adicionar o resultado do exame: ", error);
            res.status(500).json({ message: 'Erro inesperado ao adicionar o resultado do exame!', error });
        }
    }

    static async GetExamResultById(req, res) {
        try {
            const { id } = req.params;
            const exam = await Exam.findOne({ where: { id } });

            if (exam) {
                res.status(200).json(exam.resultFile);
            }
        } catch (error) {
            console.error("Erro ao buscar o resultado do exame: ", error);
            res.status(500).json({ message: "Erro inesperado ao buscar resultado do exame: ", error });
        }
    }
}

module.exports = ExamController;
