const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');

class User extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
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
    password: {
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
    }
}, {
    sequelize,
    modelName: "User",
    tableName: "usuarios",
    hooks: {
        beforeCreate: async (user) => {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
        }
    }
});

module.exports = User;