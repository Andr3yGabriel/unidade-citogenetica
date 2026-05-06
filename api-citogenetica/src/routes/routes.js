const UserType = require('../models/UserType').default;
const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig').default;

// Middlewares
const { authenticateToken, authorize } = require('../middleware/authMiddleware');

// Controllers
const {
    UserController,
    ExamController,
    ReportController,
    AuthController,
    AdminController
} = require('../controllers');

const PacienteBuscaController = require('../controllers/PacienteBuscaController');

// --- Rotas de Autenticação (Públicas) ---
router.post('/auth/login', AuthController.login);
router.post('/auth/register/patient', AuthController.patientRegister);
router.post('/auth/request-password-reset', AuthController.requestPasswordReset);
// O restante do fluxo de reset (verify, reset) também seria público.

// --- Rotas de Administrador (Protegidas e Autorizadas) ---
router.post('/admin/register/worker',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerRegister
);

// --- Rotas de Usuário (Ações do próprio usuário logado) ---
router.patch('/user/update-password',
    authenticateToken, // Qualquer usuário logado pode acessar
    UserController.updatePassword
);

// --- Rotas de Exames (Protegidas com autorização específica) ---
router.post('/exams',
    authenticateToken,
    authorize(['tecnico', 'admin']),
    ExamController.createExam
);
router.get('/exams/all',
    authenticateToken,
    authorize(['tecnico', 'admin']),
    ExamController.listAllExams
);
router.get('/exams/doctor/:doctorId',
    authenticateToken,
    authorize(['medico']),
    ExamController.listDoctorExams
);
router.get('/exams/patient/:patientId',
    authenticateToken,
    authorize(['paciente', 'medico', 'tecnico', 'admin']),
    ExamController.listPatientExams
);

// --- Rotas de Laudos (Protegidas) ---
// Precisaria de um middleware de upload (ex: multer) aqui.
router.post('/reports/upload/:examId',
    authenticateToken,
    authorize(['tecnico']),
    upload.single('laudoFile'), // Exemplo com multer
    ReportController.uploadReport
);

router.patch('/reports/:reportId',
    authenticateToken,
    authorize(['tecnico']),
    upload.single('laudoFile'),
    ReportController.updateReport
);

// --- Rotas de Busca de Paciente (Protegidas) ---
router.get('/pacientes/buscar',
    authenticateToken,
    authorize(['tecnico', 'medico']),
    PacienteBuscaController.buscar
);

router.get('/pacientes/buscar/cpf/:cpf',
    authenticateToken,
    authorize(['tecnico', 'medico']),
    PacienteBuscaController.buscarPorCpf
);

router.get('/pacientes/buscar/sus/:numeroSus',
    authenticateToken,
    authorize(['tecnico', 'medico']),
    PacienteBuscaController.buscarPorNumeroSus
);

// Rota para listar tipos de exame
router.get('/exam-types',
    authenticateToken,
    ExamController.listExamTypes
);

// Rota para buscar usuário por sesNumbero (CPF)
router.get('/users/sesNumber/:sesNumber',
    authenticateToken,
    async (req, res) => {
        try {
            const { sesNumber } = req.params;
            const user = await require('../models').default.User.findOne({
                where: { sesNumber },
                attributes: ['id', 'completeName', 'email', 'sesNumber']
            });
            
            if (!user) {
                return res.status(404).json({ 
                    message: 'Usuário não encontrado com esse CPF' 
                });
            }
            
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao buscar usuário', 
                error: error.message 
            });
        }
    }
);

// Rota para buscar usuário por ID
router.get('/users/:userId',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await require('../models').default.User.findOne({
                where: { id: userId },
                attributes: ['id', 'completeName', 'email', 'sesNumber', 'userTypeId'],
                include: [{
                    association: 'userType',
                    attributes: ['name']
                }]
            });
            
            if (!user) {
                return res.status(404).json({ 
                    message: 'Usuário não encontrado' 
                });
            }
            
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao buscar usuário', 
                error: error.message 
            });
        }
    }
);

// --- Rotas de Gerenciamento de Usuários (Admin) ---
// Listar todos os usuários
router.get('/admin/users',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const users = await require('../models').default.User.findAll({
                attributes: ['id', 'completeName', 'email', 'sesNumber', 'userTypeId'],
                include: [{
                    association: 'userType',
                    attributes: ['name']
                }],
                order: [['completeName', 'ASC']]
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao listar usuários', 
                error: error.message 
            });
        }
    }
);

// Editar usuário
router.patch('/admin/users/:userId',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const { userId } = req.params;
            const { completeName, email, sesNumber, userTypeId } = req.body;
            
            const user = await require('../models').default.User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            await user.update({ completeName, email, sesNumber, userTypeId });
            res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao atualizar usuário', 
                error: error.message 
            });
        }
    }
);

// --- Rotas de Gerenciamento de Tipos de Exame (Admin) ---
// Criar novo tipo de exame
router.post('/admin/exam-types',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const { name } = req.body;
            const newType = await require('../models').default.ExamType.create({ name });
            res.status(201).json({ 
                message: 'Tipo de exame criado com sucesso', 
                examType: newType 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao criar tipo de exame', 
                error: error.message 
            });
        }
    }
);

// Editar tipo de exame
router.patch('/admin/exam-types/:typeId',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const { typeId } = req.params;
            const { name } = req.body;
            
            const examType = await require('../models').default.ExamType.findByPk(typeId);
            if (!examType) {
                return res.status(404).json({ message: 'Tipo de exame não encontrado' });
            }

            await examType.update({ name });
            res.status(200).json({ 
                message: 'Tipo de exame atualizado com sucesso', 
                examType 
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao atualizar tipo de exame', 
                error: error.message 
            });
        }
    }
);

// Deletar tipo de exame
router.delete('/admin/exam-types/:typeId',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const { typeId } = req.params;
            
            // Verificar se há exames usando este tipo
            const examCount = await require('../models').default.Exam.count({
                where: { examTypeId: typeId }
            });

            if (examCount > 0) {
                return res.status(400).json({ 
                    message: 'Não é possível deletar este tipo de exame pois existem exames associados a ele.' 
                });
            }

            const examType = await require('../models').default.ExamType.findByPk(typeId);
            if (!examType) {
                return res.status(404).json({ message: 'Tipo de exame não encontrado' });
            }

            await examType.destroy();
            res.status(200).json({ message: 'Tipo de exame deletado com sucesso' });
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao deletar tipo de exame', 
                error: error.message 
            });
        }
    }
);

// Listar tipos de usuário
router.get('/admin/user-types',
    authenticateToken,
    authorize(['admin']),
    async (req, res) => {
        try {
            const userTypes = await UserType.findAll({
                attributes: ['id', 'name'],
                order: [['name', 'ASC']]
            });
            res.status(200).json(userTypes);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao listar tipos de usuário', 
                error: error.message 
            });
        }
    }
);

// Buscar exame por ID com dados completos
router.get('/exams/:examId',
    authenticateToken,
    authorize(['tecnico', 'medico', 'admin']),
    async (req, res) => {
        try {
            const { examId } = req.params;
            const exam = await require('../models').default.Exam.findOne({
                where: { id: examId },
                include: [
                    { 
                        association: 'patient',
                        attributes: ['id', 'completeName', 'sesNumber', 'sesNumber', 'email']
                    },
                    { 
                        association: 'requestingDoctor',
                        attributes: ['id', 'completeName']
                    },
                    { association: 'examType' },
                    { association: 'examStatus' }
                ]
            });

            if (!exam) {
                return res.status(404).json({ message: 'Exame não encontrado' });
            }

            res.status(200).json(exam);
        } catch (error) {
            res.status(500).json({ 
                message: 'Erro ao buscar exame', 
                error: error.message 
            });
        }
    }
);

// Buscar laudo do exame (PDF)
router.get('/result/:examId',
    authenticateToken,
    async (req, res) => {
        try {
            const { examId } = req.params;
            const fs = require('fs');
            const path = require('path');

            // Buscar o laudo do exame
            const report = await require('../models').default.Report.findOne({
                where: { examId: examId }
            });

            if (!report) {
                return res.status(404).json({ message: 'Laudo não encontrado para este exame.' });
            }

            // Ler o arquivo do disco
            const filePath = path.join(__dirname, '../../', report.filePath);
            
            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Arquivo do laudo não encontrado no servidor.' });
            }

            // Ler arquivo e converter para base64
            const fileBuffer = fs.readFileSync(filePath);
            const base64 = fileBuffer.toString('base64');
            const dataUri = `data:${report.mimeType};base64,${base64}`;

            res.status(200).json(dataUri);
        } catch (error) {
            console.error('Erro ao buscar resultado:', error);
            res.status(500).json({ 
                message: 'Erro ao buscar resultado do exame.', 
                error: error.message 
            });
        }
    }
);

module.exports = router;