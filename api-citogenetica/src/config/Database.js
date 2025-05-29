const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: '-03:00',
    dialectOptions: {
        dateStrings: true,
        typeCast: function (field, next) {
            if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
                return new Date(field.string() + 'Z');
            }
            return next();
        }
    }
});

module.exports = sequelize;