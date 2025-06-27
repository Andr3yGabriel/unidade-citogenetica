const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

/**
 * Gera um token JWT para um usuário.
 * * @param {object} payload - O objeto contendo os dados a serem incluídos no token.
 * @param {number} payload.userId - O ID numérico do usuário.
 * @param {string} payload.userType - O nome do papel do usuário (ex: 'Administrador').
 * @returns {string} O token JWT gerado.
 */
function generateToken(payload) {
    const { userId, userType } = payload;
    const secretKey = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h'; // Pega do .env ou usa 24h como padrão

    if (!userId || !userType) {
        throw new Error('userId e userType são necessários para gerar o token!');
    }

    if (!secretKey) {
        console.error("ERRO FATAL: A chave secreta JWT (JWT_SECRET) não está definida no .env!");
        throw new Error('A chave secreta JWT não está definida!');
    }

    // O payload do token será { userId, userType }
    // O middleware irá decodificar isso e colocar em req.user
    return jwt.sign(
        { userId, userType },
        secretKey,
        { expiresIn }
    );
}

module.exports = { generateToken };