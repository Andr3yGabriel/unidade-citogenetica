import { Model, DataTypes, Optional } from "sequelize";
import sequelize from '../config/Database';

export interface ReportAttributes {
    id: number;
    examId: number;
    filePath: string;
    fileName: string;
    mimeType: string;
    fileSizeBytes: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReportCreationAttributes extends Optional<ReportAttributes, "id" | "createdAt" | "updatedAt"> {}

class Report extends Model<ReportAttributes, ReportCreationAttributes> implements ReportAttributes {
    public id!: number;
    public examId!: number;
    public filePath!: string;
    public fileName!: string;
    public mimeType!: string;
    public fileSizeBytes!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
    createdAt: {
        field: "data_upload",
        type: DataTypes.DATE,
        allowNull: false
    },
    updatedAt: {
        field: "data_atualizacao",
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "Report",
    tableName: "laudos"
});

export default Report;