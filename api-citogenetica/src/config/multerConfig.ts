import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

const uploadDir = process.env.UPLOAD_PATH || 'uploads';

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        cb(null, uploadDir);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        crypto.randomBytes(8, (err, buf) => {
            if (err) {
                return cb(err, '');
            }
            const uniquePrefix = buf.toString('hex');
            const originalName = path.parse(file.originalname).name.replace(/\s/g, '_');
            const extension = path.extname(file.originalname);
            cb(null, `${uniquePrefix}-${originalName}${extension}`);
        });
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não suportado! Apenas PDFs são permitidos.'));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

export default upload;
