const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class ExamStatus extends Model { }

ExamStatus.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
        field: "nome",
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Ex: solicitado, pendente_amostra, analise, pronto'
    }
}, { sequelize, modelName: "ExamStatus", tableName: "status_exame", timestamps: false });

module.exports = ExamStatus;