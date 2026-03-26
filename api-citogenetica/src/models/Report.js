const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/Database').default;

class Report extends Model { }

Report.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    examId: {
        field: "id_exame",
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true
    },
    filePath: {
        field: "caminho_arquivo",
        type: DataTypes.STRING(512),
        allowNull: false,
        comment: 'Caminho no S3, GCS ou no sistema de arquivos local'
    },
    fileName: {
        field: "nome_arquivo",
        type: DataTypes.STRING,
    },
    mimeType: {
        field: "tipo_mime",
        type: DataTypes.STRING,
        comment: 'Ex: application/pdf'
    },
    fileSizeBytes: {
        field: "tamanho_bytes",
        type: DataTypes.BIGINT
    },
    uploadDate: {
        field: "data_upload",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        field: "data_atualizacao",
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "Report",
    tableName: "laudos",
    timestamps: true,
    createdAt: 'uploadDate',
    updatedAt: 'updatedAt'
});

module.exports = Report;