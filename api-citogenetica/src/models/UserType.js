const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');

class UserType extends Model { }

UserType.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        field: 'nome',
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        comment: 'Ex: paciente, medico, tecnico, admin'
    },
    description: {
        field: 'descricao',
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: "UserType",
    tableName: "tipos_usuario",
    timestamps: false
});

module.exports = UserType;