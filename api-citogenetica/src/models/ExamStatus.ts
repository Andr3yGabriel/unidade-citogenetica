import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';

interface ExamStatusAttributes {
    id: number;
    name: string;
    title?: string;
}

interface ExamStatusCreationAttributes extends Optional<ExamStatusAttributes, "id"> { }

class ExamStatus extends Model<ExamStatusAttributes, ExamStatusCreationAttributes> implements ExamStatusAttributes {
    public id!: number;
    public name!: string;
    public title?: string;
}

ExamStatus.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        field: "nome",
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Ex: solicitado, pendente_amostra, analise, pronto'
    },
    title: {
        field: "title",
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true,
        comment: 'Título descritivo do status do exame'
    }
}, { sequelize, modelName: "ExamStatus", tableName: "status_exame", timestamps: false });

export default ExamStatus;