import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';

interface UserTypeAttributes {
    id: number;
    name: string;
    description?: string;
}

interface UserTypeCreationAttributes extends Optional<UserTypeAttributes, "id"> {}

class UserType extends Model<UserTypeAttributes, UserTypeCreationAttributes> implements UserTypeAttributes {
    public id!: number;
    public name!: string;
    public description?: string;
}

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

export default UserType;