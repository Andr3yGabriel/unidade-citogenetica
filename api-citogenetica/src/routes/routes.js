const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/PatientController');
const WorkerController = require('../controllers/WorkerController');
const ExamController = require('../controllers/ExamController');
const verifyToken = require('../middleware/authMiddleware');
const { verify } = require('jsonwebtoken');

router.post('/patient/register', PatientController.Register);
router.post('/patient/login', PatientController.Login);

router.post('/worker/register', verifyToken(['admin',]), WorkerController.Register);
router.post('/worker/login', WorkerController.Login);

router.get('/exam/doctor', verifyToken(['doctor']), ExamController.ListExamsByDoctorDocument);
router.get('/exam/patient', verifyToken(['patient']), ExamController.GetExamsByPatientDocument);
router.get('/patient', verifyToken(['admin', 'technical', 'doctor', 'patient']), PatientController.GetPatientInfo);
router.get('/exams', verifyToken(['technical', 'admin']), ExamController.ListAllExams);
router.post('/exam', verifyToken(['technical', 'admin']), ExamController.AddExam);
router.put('/examFile', verifyToken(['technical']), ExamController.AddExamFile);
router.get('/result/:id', verifyToken(['doctor', 'technical', 'admin', 'patient']), ExamController.GetExamResultById);

module.exports = router;