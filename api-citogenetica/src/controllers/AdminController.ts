import { Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';

class AdminController {
    static async workerRegister(req: Request, res: Response): Promise<void> {
        try {
            const { completeName, password, email, document, userTypeId } = req.body;

            const userType = await UserRepository.findUserTypeById(userTypeId);
            if (!userType || userType.name === 'paciente') {
                res.status(400).json({ message: 'Tipo de usuário inválido para um funcionário.' });
                return;
            }

            const existingUser = await UserRepository.findUserByEmail(email);
            if (existingUser) {
                res.status(409).json({ message: 'Este e-mail já está em uso.' });
                return;
            }

            const newUser = await UserRepository.createUser({ completeName, password_hash: password, email, document, userTypeId });
            res.status(201).json({ message: 'Funcionário registrado com sucesso!', user: newUser });
        } catch (error: any) {
            res.status(500).json({ message: 'Erro inesperado ao registrar funcionário.', error: error.message });
        }
    }
}

export default AdminController;