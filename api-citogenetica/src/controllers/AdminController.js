const { User, UserType } = require('../models');

class AdminController {
    /**
     * Registra um novo funcionário (Médico, Técnico, etc.). Rota somente para Admin.
     */
    static async workerRegister(req, res) {
        try {
            const { completeName, password, email, document, userTypeId } = req.body;

            const userType = await UserType.findByPk(userTypeId);
            if (!userType || userType.name === 'paciente') {
                return res.status(400).json({ message: 'Tipo de usuário inválido para um funcionário.' });
            }

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) return res.status(409).json({ message: 'Este e-mail já está em uso.' });

            const newUser = await User.create({ completeName, password, email, document, userTypeId });
            res.status(201).json({ message: 'Funcionário registrado com sucesso!', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Erro inesperado ao registrar funcionário.', error: error.message });
        }
    }
}

module.exports = AdminController;