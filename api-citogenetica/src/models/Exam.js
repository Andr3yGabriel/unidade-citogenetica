const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class Exam extends Model { }

Exam.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientId: {
        field: "id_paciente",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    requestingDoctorId: {
        field: "id_medico_solicitante",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    responsibleTechnicianId: {
        field: "id_tecnico_responsavel",
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    examTypeId: {
        field: "id_tipo_exame",
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    examStatusId: {
        field: "id_status_exame",
        type: DataTypes.INTEGER,
        allowNull: false
    },
    conclusionDate: {
        field: "data_conclusao",
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: "Exam",
    tableName: "exames",
    timestamps: true,
    createdAt: 'data_solicitacao',
    updatedAt: 'data_atualizacao',
});

module.exports = Exam;