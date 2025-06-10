const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

function generateToken(payload) {
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

module.exports = { generateToken };