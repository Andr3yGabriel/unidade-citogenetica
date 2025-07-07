import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { generateToken } from '../services';
import { sendPasswordResetEmail } from '../services/EmailService';
import crypto from 'crypto';

class AuthController {
    static async patientRegister(req: Request, res: Response): Promise<void> {
        try {
            const { completeName, password, email, document } = req.body;
            const patientType = await UserRepository.findUserTypeById(3); // ID 3 para paciente
            if (!patientType) {
                res.status(500).json({ message: 'Configuração de papel "paciente" não encontrada.' });
                return;
            }

            const existingUser = await UserRepository.findUserByEmail(email);
            if (existingUser) {
                res.status(409).json({ message: 'Este e-mail já está em uso.' });
                return;
            }

            const newUser = await UserRepository.createUser({ completeName, password_hash: password, email, document, userTypeId: patientType.id });
            res.status(201).json({ message: 'Paciente registrado com sucesso!', userId: newUser.id });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro inesperado ao registrar paciente.', error: error.message });
        }
    }

    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { document, password } = req.body;
            const user = await UserRepository.findUserByDocument(document);

            if (!user || !(await user.validatePassword(password))) {
                res.status(401).json({ message: 'Credenciais inválidas.' });
                return;
            }

            const payload = { userId: user.id, userType: (user as any).userType.name };
            const token = generateToken(payload);
            res.status(200).json({ token, userType: (user as any).userType.name, userId: user.id });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro inesperado durante o login.', error: error.message });
        }
    }

    static async requestPasswordReset(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            const user = await UserRepository.findUserByEmail(email);

            if (user) {
                const resetToken = crypto.randomBytes(32).toString('hex');
                user.passwordResetToken = resetToken;
                const ONE_HOUR = 3600000; // 1 hora em ms
                user.passwordResetExpires = new Date(Date.now() + ONE_HOUR);
                await UserRepository.updateUser(user, { passwordResetToken: resetToken, passwordResetExpires: new Date(Date.now() + ONE_HOUR) });

                const resetUrl = `${process.env.FRONTEND_URL}/resetar-senha?token=${resetToken}`;
                await sendPasswordResetEmail(user.email, user.completeName, resetUrl);
            }

            res.status(200).json({ message: 'Se um usuário com este e-mail existir, instruções para redefinir a senha foram enviadas.' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao solicitar redefinição de senha.', error: error.message });
        }
    }
}

export default AuthController;
