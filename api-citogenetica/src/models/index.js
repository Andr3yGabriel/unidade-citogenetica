const Exam = require("./Exam");
const Patient = require("./Patient");
const Worker = require("./Worker")


Patient.hasMany(Exam, { foreignKey: 'patientDocument', as: 'PatientExams' });
Exam.belongsTo(Patient, { foreignKey: 'patientDocument', as: 'Patient' });

Worker.hasMany(Exam, { foreignKey: 'doctorDocument', as: 'DoctorExams' });
Exam.belongsTo(Worker, { foreignKey: 'doctorDocument', as: 'Doctor' });