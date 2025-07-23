import express from 'express';
import upload from '../config/multerConfig';

import { authenticateToken, authorize } from '../middleware/authMiddleware';

import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import ExamController from '../controllers/ExamController';
import ReportController from '../controllers/ReportController';
import UserController from '../controllers/UserController';

const router = express.Router();

router.get('/', (req, res) => { res.send('API Running!'); });

router.post('/auth/login', AuthController.login);
router.post('/auth/register/patient', AuthController.patientRegister);
router.post('/auth/request-password-reset', AuthController.requestPasswordReset);
router.post('/auth/reset-password', AuthController.resetPassword);

router.post('/admin/register/worker',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerRegister
);

router.get('/admin/workers',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerList
);

router.patch('/admin/workers/deactivate/:userId',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerDeactivate
);

router.patch('/admin/workers/activate/:userId',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerActivate
);

router.patch('/user/update-password',
    authenticateToken,
    UserController.updatePassword
);

router.get('/users/document/:document',
    authenticateToken,
    authorize(['medico']),
    UserController.findUserByDocument
);

router.post('/exams',
    authenticateToken,
    authorize(['tecnico', 'admin', 'medico']),
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

router.get('/exam-types',
    authenticateToken,
    authorize(['medico']),
    ExamController.listExamTypes
)

router.get('/user-types',
    authenticateToken,
    authorize(['admin']),
    UserController.listUserTypes
);

router.post('/reports/upload/:examId',
    authenticateToken,
    authorize(['tecnico']),
    upload.single('laudoFile'),
    ReportController.uploadReport
);

router.patch('/reports/:reportId',
    authenticateToken,
    authorize(['tecnico']),
    upload.single('laudoFile'),
    ReportController.updateReport
);

router.get('/reports/:examId',
    authenticateToken,
    authorize(['tecnico', 'admin', 'paciente', 'medico']),
    ReportController.getReportByExamId
);

router.get('/reports/download/:examId',
    authenticateToken,
    authorize(['tecnico', 'admin', 'paciente', 'medico']),
    ReportController.downloadReport
);

export default router;