const jwt = require('jsonwebtoken');
const { User, UserType } = require('../models');

/**
 * Middleware para autenticar o token JWT.
 * Verifica o token no header 'Authorization', valida-o e anexa os dados do usuário à requisição.
 */
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Anexar informações do usuário decodificadas à requisição para uso posterior
        // O payload do seu token deve conter o ID e o tipo do usuário.
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
};

/**
 * Middleware de autorização baseado em papéis (roles).
 * Deve ser usado APÓS o middleware authenticateToken.
 * @param {Array<string>} allowedRoles - Um array com os nomes dos papéis permitidos. Ex: ['Administrador', 'Médico']
 */
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.userType) {
            return res.status(403).json({ message: 'Permissão negada. Informações de usuário ausentes.' });
        }

        const { userType } = req.user;

        if (allowedRoles.includes(userType)) {
            next(); // O usuário tem o papel permitido, pode prosseguir.
        } else {
            return res.status(403).json({ message: 'Acesso proibido. Você não tem permissão para realizar esta ação.' });
        }
    };
};

module.exports = {
    authenticateToken,
    authorize,
};
