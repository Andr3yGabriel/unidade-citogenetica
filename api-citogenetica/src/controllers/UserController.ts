import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { sendPasswordChangedEmail } from '../services/EmailService';

class UserController {
    static async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = (req as any).user.userId; // ID do usuário logado, vindo do token.

            const user = await UserRepository.findUserById(userId);
            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado.' });
                return;
            }

            const isPasswordValid = await user.validatePassword(oldPassword);
            if (!isPasswordValid) {
                res.status(401).json({ message: 'A senha antiga está incorreta.' });
                return;
            }

            await UserRepository.updateUser(user, { password_hash: newPassword });

            sendPasswordChangedEmail(user.email, user.completeName).catch(err => console.error("Falha ao enviar e-mail de confirmação:", err));

            res.status(200).json({ message: 'Senha atualizada com sucesso.' });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao atualizar a senha.', error: error.message });
        }
    }

    static async findUserByDocument(req: Request, res: Response): Promise<void> {
        try {
            const { document } = req.params;
            const user = await UserRepository.findUserByDocument(document);

            if (!user) {
                res.status(404).json({ message: 'Usuário não encontrado.' });
                return;
            }

            res.status(200).json(user);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao buscar usuário.', error: error.message });
        }
    }

    static async listUserTypes(req: Request, res: Response): Promise<void> {
        try {
            const userTypes = await UserRepository.findAllUserTypes();
            res.status(200).json(userTypes);
        } catch (error: any) {
            res.status(500).json({ message: 'Erro ao listar tipos de usuário.', error: error.message });
        }
    }
}

export default UserController;