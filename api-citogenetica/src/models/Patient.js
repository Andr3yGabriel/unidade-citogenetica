const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');

class Patient extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

Patient.init({
    completeName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    document: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    registrationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('registrationDate');
            return rawValue ? moment(rawValue).tz('America/Sao_Paulo').format() : null;
        },
        allowNull: false,
    },
}, { sequelize, modelName: "patient", tableName: "patient", timestamps: false });

Patient.beforeCreate(async (patient) => {
    const hash = await bcrypt.hash(patient.password, 10);
    patient.password = hash;
});

module.exports = Patient;