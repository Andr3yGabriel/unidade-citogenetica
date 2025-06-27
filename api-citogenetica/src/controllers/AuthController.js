const { User, UserType } = require('../models');
const { generateToken } = require('../services');
const { sendPasswordResetEmail } = require('../services/EmailService');
const crypto = require('crypto');

class AuthController {
    /**
     * Registra um novo paciente. Rota aberta.
     */
    static async patientRegister(req, res) {
        try {
            const { completeName, password, email, document } = req.body;
            const patientType = await UserType.findOne({ where: { name: 'paciente' } });
            if (!patientType) return res.status(500).json({ message: 'Configuração de papel "paciente" não encontrada.' });

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(409).json({ message: 'Este e-mail já está em uso.' });

            const newUser = await User.create({ completeName, password, email, document, userTypeId: patientType.id });
            res.status(201).json({ message: 'Paciente registrado com sucesso!', userId: newUser.id });
        } catch (error) {
            res.status(500).json({ message: 'Erro inesperado ao registrar paciente.', error: error.message });
        }
    }

    /**
     * Realiza o login do usuário. Rota aberta.
     */
    static async login(req, res) {
        try {
            const { document, password } = req.body;
            const user = await User.findOne({
                where: { document },
                include: [{ model: UserType, as: 'userType', attributes: ['name'] }]
            });

            if (!user || !(await user.validatePassword(password))) {
                return res.status(401).json({ message: 'Credenciais inválidas.' });
            }

            const payload = { userId: user.id, userType: user.userType.name };
            const token = generateToken(payload);
            res.status(200).json({ token, userType: user.userType.name, userId: user.id });
        } catch (error) {
            res.status(500).json({ message: 'Erro inesperado durante o login.', error: error.message });
        }
    }

    /**
     * Inicia o fluxo de "esqueci minha senha". Rota aberta.
     */
    static async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ where: { email } });

            if (!user) {
                res.status(200).json({ message: 'Se um usuário com este e-mail existir, instruções para redefinir a senha foram enviadas.' });
            }

            if (user) {
                const resetToken = crypto.randomBytes(32).toString('hex');
                user.passwordResetToken = resetToken;
                const ONE_HOUR = 3600000; // 1 hora em ms
                user.passwordResetExpires = Date.now() + ONE_HOUR;
                await user.save();

                const resetUrl = `${process.env.FRONTEND_URL}/resetar-senha?token=${resetToken}`;
                await sendPasswordResetEmail(user.email, user.completeName, resetUrl);
            }

            res.status(200).json({ message: 'Se um usuário com este e-mail existir, instruções para redefinir a senha foram enviadas.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao solicitar redefinição de senha.', error: error.message });
        }
    }
}

module.exports = AuthController;
