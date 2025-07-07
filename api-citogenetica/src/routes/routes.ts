import express from 'express';
import upload from '../config/multerConfig';

import { authenticateToken, authorize } from '../middleware/authMiddleware';

import AdminController from '../controllers/AdminController';
import AuthController from '../controllers/AuthController';
import ExamController from '../controllers/ExamController';
import ReportController from '../controllers/ReportController';
import UserController from '../controllers/UserController';

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/register/patient', AuthController.patientRegister);
router.post('/auth/request-password-reset', AuthController.requestPasswordReset);

router.post('/admin/register/worker',
    authenticateToken,
    authorize(['admin']),
    AdminController.workerRegister
);

router.patch('/user/update-password',
    authenticateToken,
    UserController.updatePassword
);

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

export default router;