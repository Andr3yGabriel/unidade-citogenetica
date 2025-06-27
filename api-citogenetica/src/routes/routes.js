const express = require('express');
const router = express.Router();
const upload = require('../config/multerConfig');

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
    authorize(['paciente']),
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

module.exports = router;