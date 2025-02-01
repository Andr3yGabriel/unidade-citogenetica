const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class UserType extends Model { }

UserType.init({
    key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, { sequelize, modelName: "user_type", tableName: "user_type" });

UserType.seed = async () => {
    const initialTypes = [
        { key: 1, type: 'Paciente' },
        { key: 2, type: 'Medico' },
        { key: 3, type: 'Tecnico' }
    ];

    for (const userType of initialTypes) {
        await UserType.findOrCreate({
            where: { key: userType.key },
            defaults: userType
        });
    }
};

module.exports = UserType;