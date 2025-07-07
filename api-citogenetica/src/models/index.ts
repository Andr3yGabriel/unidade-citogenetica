import sequelize from '../config/Database';
import { Sequelize } from 'sequelize';

import UserType from './UserType';
import User from './User';
import ExamType from './ExamType';
import ExamStatus from './ExamStatus';
import Exam from './Exam';
import Report from './Report';

const models = {
    UserType,
    User,
    ExamType,
    ExamStatus,
    Exam,
    Report
};

UserType.hasMany(User, { foreignKey: 'userTypeId', as: 'users' });
User.belongsTo(UserType, { foreignKey: 'userTypeId', as: 'userType' });

ExamType.hasMany(Exam, { foreignKey: 'examTypeId', as: 'exams' });
Exam.belongsTo(ExamType, { foreignKey: 'examTypeId', as: 'examType' });

ExamStatus.hasMany(Exam, { foreignKey: 'examStatusId', as: 'exams' });
Exam.belongsTo(ExamStatus, { foreignKey: 'examStatusId', as: 'examStatus' });

User.hasMany(Exam, { foreignKey: 'patientId', as: 'patientExams' });
Exam.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });

User.hasMany(Exam, { foreignKey: 'requestingDoctorId', as: 'requestedExams' });
Exam.belongsTo(User, { foreignKey: 'requestingDoctorId', as: 'requestingDoctor' });

User.hasMany(Exam, { foreignKey: 'responsibleTechnicianId', as: 'handledExams' });
Exam.belongsTo(User, { foreignKey: 'responsibleTechnicianId', as: 'responsibleTechnician' });

Exam.hasOne(Report, { foreignKey: 'examId', as: 'report' });
Report.belongsTo(Exam, { foreignKey: 'examId', as: 'exam' });

const db = {
    ...models,
    sequelize
};

export default db;