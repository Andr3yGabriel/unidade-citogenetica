const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.JWT_SECRET;

class UserController {
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
            const { completeName, password, email, document, type } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Usuário com esse email já existe!' });
            }

            const newUser = await User.create({ completeName, password, email, document, type });
            const token = UserController.generateToken({ document: newUser.document, type: type, expiresIn: '1h' });

            res.status(201).json({ message: 'Usuário registrado com sucesso!', token });
        } catch (error) {
            console.error('Erro durante regsitro do usuário:', error);
            res.status(500).json({ message: 'Erro inesperado ao realizar registro: ', error });
        }
    }

    static async Login(req, res) {
        try {
            const { document, password } = req.body;

            const user = await User.findOne({ where: { document } });

            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado!' });
            }

            const isPasswordValid = await user.validatePassword(password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Credenciais inválidas!' });
            }

            const token = UserController.generateToken({ document: user.document, type: user.type, expiresIn: '1h' });
            res.status(200).json({ message: 'Login feito com sucesso!', token });
        } catch (error) {
            console.error('Erro durante o login:', error);
            res.status(500).json({ message: 'Erro inesperado durante o login! ', error });
        }
    }

    static async FindUserByDocument(req, res) {
        try {
            const { document } = req.params;

            const user = await User.findOne({ where: { document } });

            if (!user) {
                res.status(404).json({ message: "Usuário não encontrado!" });
            }

            res.status(200).json(user.completeName);
        } catch (error) {
            console.error("Erro inesperado ao encontrar usuário: ", error);
            res.status(500).json({ message: "Erro inesperado ao buscar usuário!" });
        }
    }
}

module.exports = UserController;
