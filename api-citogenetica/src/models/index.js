const Exam = require("./Exam");
const User = require("./User");

User.hasMany(Exam, { foreignKey: 'patientDocument', as: 'PatientExams' });
Exam.belongsTo(User, { foreignKey: 'patientDocument', as: 'Patient' });

User.hasMany(Exam, { foreignKey: 'doctorDocument', as: 'DoctorExams' });
Exam.belongsTo(User, { foreignKey: 'doctorDocument', as: 'Doctor' });