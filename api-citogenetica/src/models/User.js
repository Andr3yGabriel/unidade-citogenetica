const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');

class User extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

User.init({
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
    type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "user_type",
            key: "key"
        }
    }
}, { sequelize, modelName: "user", tableName: "user" });

User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
});

module.exports = User;