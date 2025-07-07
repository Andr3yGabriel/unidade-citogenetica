import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import UserType from '../models/UserType';

interface AuthenticatedRequest extends Request {
    user?: { userId: number; userType: string; };
}

export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number; userType: string; };
        req.user = decoded;
        next();
    } catch (error: any) {
        res.status(403).json({ message: 'Token inválido ou expirado.' });
        return;
    }
};

export const authorize = (allowedRoles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !req.user.userType) {
            res.status(403).json({ message: 'Permissão negada. Informações de usuário ausentes.' });
            return;
        }

        const { userType } = req.user;

        if (allowedRoles.includes(userType)) {
            next();
        } else {
            res.status(403).json({ message: 'Acesso proibido. Você não tem permissão para realizar esta ação.' });
            return;
        }
    };
};
