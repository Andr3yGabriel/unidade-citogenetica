class ExameService{


        static async createExam(exameData) {
        try {
            const { patientId, requestingDoctorId, examTypeId } = req.body;
            const initialStatus = await db.ExamStatus.findOne({ where: { name: 'solicitado' } });
            if (!initialStatus) return res.status(500).json({ message: 'Status "solicitado" não configurado.' });

            const newExam = await db.Exam.create({
                patientId: exameData.patientId,
                requestingDoctorId: exameData.requestingDoctorId,
                examTypeId: exameData.examTypeId,
                examStatusId: initialStatus.id,
                nomeExame: exameData.nomeExame || 'Exame Padrão',
            });
            res.status(201).json({ message: "Exame registrado com sucesso!", exam: newExam });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao registrar exame.', error: error.message });
        }
    }
}

module.exports = ExameService;