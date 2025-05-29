const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');

class Worker extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

Worker.init({
    document: {
        type: DataTypes.STRING(11),
        allowNull: false,
        primaryKey: true
    },
    completeName: {
        type: DataTypes.STRING(70),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
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
    salary: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        precision: 10,
        scale: 2,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING(20),
        allowNull: false,
    }
}, { sequelize, modelName: "worker", tableName: "worker", timestamps: false });

Worker.beforeCreate(async (worker) => {
    const hash = await bcrypt.hash(worker.password, 10);
    worker.password = hash;
});

module.exports = Worker;