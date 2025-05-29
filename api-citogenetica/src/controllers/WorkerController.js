const jwt = require('jsonwebtoken');
const Worker = require('../models/Worker');
const secretKey = process.env.JWT_SECRET;

class WorkerController {
    static generateToken(payload) {
        const { document, type, expiresIn } = payload;

        if (!document || !type || !expiresIn) {
            throw new Error('Missing information for token generation!');
        }

        if (!secretKey) {
            throw new Error('JWT secret key is not defined!');
        }

        return jwt.sign(
            { document, type },
            secretKey,
            { expiresIn }
        );
    }

    static async Register(req, res) {
        try {
            const { completeName, password, email, document, position, salary } = req.body;

            const existingWorker = await Worker.findOne({ where: { document } });
            if (existingWorker) {
                return res.status(400).json({ message: 'Trabalhador com esse CPF já existe!' });
            }

            const newWorker = await Worker.create({ completeName, password, email, document, position, salary });
            const token = WorkerController.generateToken({ document: newWorker.document, type: position, expiresIn: '1h' });

            res.status(201).json({ message: 'Trabalhador registrado com sucesso!', token });
        } catch (error) {
            console.error('Erro durante registro do trabalhador:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar registro: ', error });
        }
    }

    static async Login(req, res) {
        try {
            const { document, password } = req.body;

            const worker = await Worker.findOne({ where: { document } });

            if (!worker) {
                return res.status(404).json({ message: 'Trabalhador não encontrado!' });
            }

            const isPasswordValid = await worker.validatePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas!' });
            }

            const token = WorkerController.generateToken({ document: worker.document, type: worker.position, expiresIn: '1h' });
            res.status(200).json({ message: 'Login feito com sucesso!', token });
        } catch (error) {
            console.error('Erro durante login do trabalhador:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar login: ', error });
        }
    }
}

module.exports = WorkerController;