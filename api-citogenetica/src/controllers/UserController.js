const User = require('../models/User');
const { generateToken } = require('../services');

class UserController {
    static async PatientRegister(req, res) {
        try {
            const { completeName, password, email, document } = req.body;
            const existingUser = await User.findOne({ where: { document } });

            if (existingUser) {
                return res.status(400).json({ message: 'Usuário com esse CPF já existe!' });
            }

            const newUser = await User.create({ completeName, password, email, document, type: 'patient' });
            const token = generateToken({ document: newUser.document, type: newUser.type, expiresIn: '1h' });

            res.status(201).json({ message: 'Usuário registrado com sucesso!', token });
        } catch (error) {
            console.error('Erro durante registro do usuário:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar registro: ', error });
        }
    }

    static async WorkerRegister(req, res) {
        try {
            const { completeName, password, email, document, salary, position, type } = req.body;
            const existingUser = await User.findOne({ where: { document } });

            if (existingUser) {
                return res.status(400).json({ message: 'Usuário com esse CPF já existe!' });
            }

            const newUser = await User.create({
                completeName,
                password,
                email,
                document,
                salary,
                position,
                type
            });

            const token = generateToken({ document: newUser.document, type: newUser.type, expiresIn: '1h' });

            res.status(201).json({ message: 'Trabalhador registrado com sucesso!', token });
        } catch (error) {
            console.error('Erro durante registro do trabalhador:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar registro: ', error });
        }
    }

    static async GetPatientName(req, res) {
        try {
            const { document } = req.query;

            if (!document) {
                return res.status(400).json({ message: 'O parâmetro "document" é obrigatório.' });
            }

            const patient = await User.findOne({
                where: { document: document, type: 'patient' },
                attributes: ['completeName']
            });

            if (!patient) {
                return res.status(404).json({ message: 'Paciente não encontrado!' });
            }

            res.status(200).json(patient.completeName);
        } catch (error) {
            console.error('Erro ao obter informações do paciente:', error);
            res.status(500).json({ message: 'Erro inesperado ao obter informações do paciente!' });
        }
    }

    static async Login(req, res) {
        try {
            const { document, password } = req.body;

            const user = await User.findOne({ where: { document }, attributes: ['type'] });

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            const isPasswordValid = await user.validatePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas!' });
            }

            const token = generateToken({ document: document, type: user.type, expiresIn: '1h' });
            res.status(200).json({ message: 'Login feito com sucesso!', token });
        } catch (error) {
            console.error('Erro durante o login:', error);
            res.status(500).json({ message: 'Erro inesperado durante o login! ', error });
        }
    }
}

module.exports = UserController;
