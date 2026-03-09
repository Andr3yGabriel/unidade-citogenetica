import nodemailer from 'nodemailer';
import 'dotenv/config';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("Erro Crítico: As variáveis de ambiente EMAIL_USER e EMAIL_PASS devem ser definidas.");
}

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false }
});

const createPasswordResetHtml = (userName: string, resetUrl: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div class="container" style="max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px;">
            <div class="header" style="text-align: center; border-bottom: 1px solid #dee2e6; padding-bottom: 20px; margin-bottom: 20px;">
                <h2 style="color: #212529;">Redefinição de Senha</h2>
            </div>
            <div class="content" style="font-size: 16px; line-height: 1.7; color: #495057;">
                <p>Olá, ${userName},</p>
                <p>Recebemos uma solicitação para redefinir a senha da sua conta. Se foi você, clique no botão abaixo para criar uma nova senha.</p>
                <div class="button-container" style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background-color: #0d6efd; color: #ffffff !important; text-decoration: none; font-weight: bold; border-radius: 5px;">Redefinir Senha</a>
                </div>
                <p>Este link é válido por <strong>1 hora</strong>.</p>
                <p>Se você não solicitou esta redefinição, pode ignorar este e-mail com segurança.</p>
            </div>
        </div>
    </body>
    </html>`;
};

const createPasswordChangedHtml = (userName: string): string => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <div class="container" style="max-width: 600px; margin: 40px auto; padding: 30px; background-color: #ffffff; border: 1px solid #dee2e6; border-radius: 8px;">
            <div class="header" style="text-align: center; border-bottom: 1px solid #dee2e6; padding-bottom: 20px; margin-bottom: 20px;">
                <h2 style="color: #212529;">Confirmação de Segurança</h2>
            </div>
            <div class="content" style="font-size: 16px; line-height: 1.7; color: #495057;">
                <p>Olá, ${userName},</p>
                <p>Este é um e-mail para confirmar que a senha da sua conta foi alterada com sucesso.</p>
                <p>Se você não realizou esta alteração, por favor, entre em contato com nosso suporte imediatamente.</p>
            </div>
        </div>
    </body>
    </html>`;
};

export const sendPasswordResetEmail = async (userEmail: string, userName: string, resetUrl: string): Promise<void> => {
    const mailOptions = {
        from: `"Hospital de Apoio de Brasília" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Instruções para Redefinição de Senha',
        html: createPasswordResetHtml(userName, resetUrl),
    };
    try {
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] E-mail de redefinição enviado para ${userEmail}.`);
    } catch (error) {
        console.error(`[EmailService] Falha ao enviar o e-mail de redefinição para ${userEmail}:`, error);
        throw new Error('Falha ao enviar o e-mail de redefinição de senha.');
    }
};

export const sendPasswordChangedEmail = async (userEmail: string, userName: string): Promise<void> => {
    const mailOptions = {
        from: `"Hospital de Apoio de Brasília" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: 'Sua senha foi alterada',
        html: createPasswordChangedHtml(userName),
    };
    try {
        await transporter.verify();
        await transporter.sendMail(mailOptions);
        console.log(`[EmailService] E-mail de confirmação de senha alterada enviado para ${userEmail}.`);
    } catch (error) {
        console.error(`[EmailService] Falha ao enviar o e-mail de confirmação para ${userEmail}:`, error);
    }
};
