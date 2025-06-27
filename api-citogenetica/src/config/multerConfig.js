const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// O caminho para o diretório onde os arquivos serão armazenados.
// Lendo da variável de ambiente que definimos no docker-compose.
const uploadDir = process.env.UPLOAD_PATH || 'uploads';

// Garante que o diretório de upload exista.
// Isso é importante pois o multer não cria o diretório sozinho.
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração de armazenamento do Multer
const storage = multer.diskStorage({
    // Destino do arquivo
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    // Nome do arquivo
    filename: (req, file, cb) => {
        // Gera um nome de arquivo único para evitar conflitos e problemas de segurança.
        // Ex: 16a2b3c4d5e6f7a8-laudo_paciente_xyz.pdf
        crypto.randomBytes(8, (err, buf) => {
            if (err) {
                return cb(err);
            }
            const uniquePrefix = buf.toString('hex');
            const originalName = path.parse(file.originalname).name.replace(/\s/g, '_');
            const extension = path.extname(file.originalname);
            cb(null, `${uniquePrefix}-${originalName}${extension}`);
        });
    }
});

// Filtro de arquivo para aceitar apenas PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado! Apenas PDFs são permitidos.'), false);
    }
};

// Middleware de upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10 // Limite de 10MB por arquivo
    },
    fileFilter: fileFilter
});

module.exports = upload;
