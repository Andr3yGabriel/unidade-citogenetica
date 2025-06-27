const { User } = require('../models');
const { sendPasswordChangedEmail } = require('../services/EmailService');

class UserController {
    /**
     * Atualiza a senha de um usuário LOGADO. Rota protegida para todos os tipos.
     */
    static async updatePassword(req, res) {
        try {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user.userId; // ID do usuário logado, vindo do token.

            const user = await User.findByPk(userId);
            if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });

            const isPasswordValid = await user.validatePassword(oldPassword);
            if (!isPasswordValid) return res.status(401).json({ message: 'A senha antiga está incorreta.' });

            user.password = newPassword; // O hook do modelo fará o hash
            await user.save();

            // Envia e-mail de notificação de forma assíncrona
            sendPasswordChangedEmail(user.email, user.completeName).catch(err => console.error("Falha ao enviar e-mail de confirmação:", err));

            res.status(200).json({ message: 'Senha atualizada com sucesso.' });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao atualizar a senha.', error: error.message });
        }
    }
}

module.exports = UserController;