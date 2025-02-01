const Exam = require("./Exam");
const User = require("./User");


User.hasMany(Exam, { foreignKey: 'patient_document', as: 'PatientExams' });
Exam.belongsTo(User, { foreignKey: 'patient_document', as: 'Patient' });

User.hasMany(Exam, { foreignKey: 'doctor_document', as: 'DoctorExams' });
Exam.belongsTo(User, { foreignKey: 'doctor_document', as: 'Doctor' });
