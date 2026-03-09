import jwt from 'jsonwebtoken';

interface JwtPayload {
    userId: number;
    userType: string;
}

export function generateToken(payload: JwtPayload): string {
    const { userId, userType } = payload;
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    if (!userId || !userType) {
        throw new Error('userId e userType são necessários para gerar o token!');
    }

    if (!secretKey) {
        console.error("ERRO FATAL: A chave secreta JWT (JWT_SECRET) não está definida no .env!");
        throw new Error('A chave secreta JWT não está definida!');
    }

    return jwt.sign(
        { userId, userType },
        secretKey,
        { expiresIn }
    );
}