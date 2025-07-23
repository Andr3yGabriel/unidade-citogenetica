import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';
import bcrypt from 'bcryptjs';

export interface UserAttributes {
    id: number;
    completeName: string;
    email: string;
    document: string;
    password_hash: string;
    userTypeId: number;
    passwordResetToken?: string | null;
    passwordResetExpires?: Date | null;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> { }

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public completeName!: string;
    public email!: string;
    public document!: string;
    public password_hash!: string;
    public userTypeId!: number;
    public passwordResetToken?: string;
    public passwordResetExpires?: Date;

    public async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password_hash);
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    completeName: {
        field: 'nome_completo',
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    document: {
        field: 'documento',
        type: DataTypes.STRING(11),
        allowNull: false,
        unique: true
    },
    password_hash: {
        field: 'senha_hash',
        type: DataTypes.STRING,
        allowNull: false,
    },
    userTypeId: {
        field: 'id_tipo_usuario',
        type: DataTypes.INTEGER,
        allowNull: false
    },
    passwordResetToken: {
        field: 'token_reset_senha',
        type: DataTypes.STRING,
        allowNull: true
    },
    passwordResetExpires: {
        field: 'expiracao_reset_senha',
        type: DataTypes.DATE,
        allowNull: true
    },
    isActive: {
        field: 'is_active',
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    createdAt: {
        field: 'data_cadastro',
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        field: 'data_atualizacao',
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "usuarios",
    hooks: {
        beforeCreate: async (user: any) => {
            const hash = await bcrypt.hash(user.password_hash, 10);
            user.password_hash = hash;
        }
    }
});

export default User;