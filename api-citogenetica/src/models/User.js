const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/Database").default;
const bcrypt = require("bcryptjs");

class User extends Model {
  async validatePassword(password) {
    return await bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    completeName: {
      field: "nome_completo",
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    document: {
      field: "documento",
      type: DataTypes.STRING(11),
      allowNull: false,
      unique: true,
    },
    sesNumber: {
      field: "numero_ses",
      type: DataTypes.STRING(15),
      allowNull: true,
      unique: true,
    },
    dateOfBirth: {
      field: "data_nascimento",
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    motherName: {
      field: "nome_mae",
      type: DataTypes.STRING,
      allowNull: true,
    },
    password_hash: {
      field: "senha_hash",
      type: DataTypes.STRING,
      allowNull: false,
    },
    userTypeId: {
      field: "id_tipo_usuario",
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    passwordResetToken: {
      field: "token_reset_senha",
      type: DataTypes.STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      field: "expiracao_reset_senha",
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      field: "is_active",
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      field: "data_cadastro",
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: "data_atualizacao",
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "usuarios",
    hooks: {
      beforeCreate: async (user) => {
        user.password_hash = await bcrypt.hash(user.password_hash, 10);
      },
    },
  }
);

module.exports = User;
