const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class Exam extends Model { }

Exam.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    patient_document: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "user",
            key: "document"
        }
    },
    doctor_document: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: "user",
            key: "document"
        }
    },
    exam_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    file: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: "exam", tableName: "exam" });

module.exports = Exam;