const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class ExamType extends Model { }

ExamType.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        field: "nome",
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true
    }
}, { sequelize, modelName: "ExamType", tableName: "tipos_exame", timestamps: false });

module.exports = ExamType;