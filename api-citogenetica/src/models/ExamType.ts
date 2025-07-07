import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';

interface ExamTypeAttributes {
    id: number;
    name: string;
}

interface ExamTypeCreationAttributes extends Optional<ExamTypeAttributes, "id"> {}

class ExamType extends Model<ExamTypeAttributes, ExamTypeCreationAttributes> implements ExamTypeAttributes {
    public id!: number;
    public name!: string;
}

ExamType.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        field: "nome",
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    }
}, { sequelize, modelName: "ExamType", tableName: "tipos_exame", timestamps: false });

export default ExamType;