const express = require('express');
const router = express.Router();
const { UserController, ExamController } = require('../controllers');
const verifyToken = require('../middleware/authMiddleware');

router.post('/patient/register', UserController.PatientRegister);
router.post('/worker/register', verifyToken(['admin']), UserController.WorkerRegister);
router.post('/login', UserController.Login);

router.get('/exam/doctor', verifyToken(['doctor']), ExamController.ListExamsByDoctorDocument);
router.get('/exam/patient', verifyToken(['patient']), ExamController.GetExamsByPatientDocument);
router.get('/patient', verifyToken(['admin', 'technical', 'doctor', 'patient']), UserController.GetPatientName);
router.get('/exams', verifyToken(['technical', 'admin']), ExamController.ListAllExams);
router.post('/exam', verifyToken(['technical', 'admin']), ExamController.AddExam);
router.put('/examFile', verifyToken(['technical']), ExamController.AddExamFile);
router.get('/result/:id', verifyToken(['doctor', 'technical', 'admin', 'patient']), ExamController.GetExamResultById);

module.exports = router;