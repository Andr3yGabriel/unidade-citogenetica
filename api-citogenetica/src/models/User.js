const { Model } = require("../config/Database");
const sequelize = require('../config/Database');
const bcrypt = require('bcryptjs');

class User extends Model {
    async validatePassword(password) {
        return await bcrypt.compare(password, this.password);
    }
}

User.init({
    completeName: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    document: {
        type: sequelize.DataTypes.STRING(11),
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    salary: {
        type: sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    type: {
        type: sequelize.DataTypes.STRING,
        allowNull: false,
    },
    registrationDate: {
        type: sequelize.DataTypes.DATE,
        defaultValue: sequelize.DataTypes.NOW,
        get() {
            const rawValue = this.getDataValue('registrationDate');
            return rawValue ? moment(rawValue).tz('America/Sao_Paulo').format() : null;
        },
        allowNull: false,
    },
}, { sequelize, modelName: "user", tableName: "user", timestamps: false });

User.beforeCreate(async (user) => {
    const hash = await bcrypt.hash(user.password, 10);
    user.password = hash;
});

module.exports = User;