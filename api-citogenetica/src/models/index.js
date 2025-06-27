const sequelize = require('../config/Database');
const Sequelize = require('sequelize');

// Importação de todos os modelos
const UserType = require('./UserType');
const User = require('./User');
const ExamType = require('./ExamType');
const ExamStatus = require('./ExamStatus');
const Exam = require('./Exam');
const Report = require('./Report');

const models = {
    UserType,
    User,
    ExamType,
    ExamStatus,
    Exam,
    Report
};

// UserType <--> User (Um Tipo de Usuário tem muitos Usuários)
UserType.hasMany(User, { foreignKey: 'userTypeId', as: 'users' });
User.belongsTo(UserType, { foreignKey: 'userTypeId', as: 'userType' });

// ExamType <--> Exam (Um Tipo de Exame tem muitos Exames)
ExamType.hasMany(Exam, { foreignKey: 'examTypeId', as: 'exams' });
Exam.belongsTo(ExamType, { foreignKey: 'examTypeId', as: 'examType' });

// ExamStatus <--> Exam (Um Status de Exame tem muitos Exames)
ExamStatus.hasMany(Exam, { foreignKey: 'examStatusId', as: 'exams' });
Exam.belongsTo(ExamStatus, { foreignKey: 'examStatusId', as: 'examStatus' });

// User <--> Exam (Múltiplas associações com aliases)
// Um Usuário (Paciente) tem muitos Exames
User.hasMany(Exam, { foreignKey: 'patientId', as: 'patientExams' });
Exam.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

// Um Usuário (Médico) tem muitos Exames solicitados
User.hasMany(Exam, { foreignKey: 'requestingDoctorId', as: 'requestedExams' });
Exam.belongsTo(User, { foreignKey: 'requestingDoctorId', as: 'requestingDoctor' });

// Um Usuário (Técnico) é responsável por muitos Exames
User.hasMany(Exam, { foreignKey: 'responsibleTechnicianId', as: 'handledExams' });
Exam.belongsTo(User, { foreignKey: 'responsibleTechnicianId', as: 'responsibleTechnician' });

// Exam <--> Report (Um Exame tem um Laudo)
Exam.hasOne(Report, { foreignKey: 'examId', as: 'report' });
Report.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

const db = {
    ...models,
    sequelize,
    Sequelize
};

module.exports = db;