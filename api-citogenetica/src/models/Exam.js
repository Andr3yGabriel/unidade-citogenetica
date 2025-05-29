const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const moment = require('moment-timezone');

class Exam extends Model { }

Exam.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    patientDocument: {
        type: DataTypes.STRING(11),
        allowNull: false,
        references: {
            model: "patient",
            key: "document"
        }
    },
    doctorDocument: {
        type: DataTypes.STRING(11),
        allowNull: false,
        references: {
            model: "worker",
            key: "document"
        }
    },
    registrationDate: {
        type: DataTypes.DATE,
        get() {
            const rawValue = this.getDataValue('registrationDate');
            return rawValue ? moment(rawValue).tz('America/Sao_Paulo').format() : null;
        },
        set(value) {
            if (value) {
                this.setDataValue('registrationDate', new Date(value));
            } else {
                this.setDataValue('registrationDate', null);
            }
        },
        allowNull: false,
    },
    resultFile: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { sequelize, modelName: "exam", tableName: "exam", timestamps: false });

module.exports = Exam;