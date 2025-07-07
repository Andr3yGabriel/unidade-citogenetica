import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';

export interface ExamAttributes {
    id: number;
    patientId: number;
    requestingDoctorId: number;
    responsibleTechnicianId?: number;
    examTypeId: number;
    examStatusId: number;
    conclusionDate?: Date;
    nomeExame: string;
}

export interface ExamCreationAttributes extends Optional<ExamAttributes, "id"> {}

class Exam extends Model<ExamAttributes, ExamCreationAttributes> implements ExamAttributes {
    public id!: number;
    public patientId!: number;
    public requestingDoctorId!: number;
    public responsibleTechnicianId?: number;
    public examTypeId!: number;
    public examStatusId!: number;
    public conclusionDate?: Date;
    public nomeExame!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
    nomeExame: {
        field: "nome_exame",
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: "Exam",
    tableName: "exames",
    timestamps: true,
    createdAt: 'data_solicitacao',
    updatedAt: 'data_atualizacao',
});

export default Exam;