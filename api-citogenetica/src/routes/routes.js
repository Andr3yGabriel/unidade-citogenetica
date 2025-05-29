const express = require('express');
const router = express.Router();
const PatientController = require('../controllers/PatientController');
const WorkerController = require('../controllers/WorkerController');
const ExamController = require('../controllers/ExamController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/patient/register', PatientController.Register);
router.post('/patient/login', PatientController.Login);

router.post('/worker/register', verifyToken(['admin',]), WorkerController.Register);
router.post('/worker/login', WorkerController.Login);

router.get('/exam/doctor', verifyToken(['doctor']), ExamController.ListExamsByDoctorDocument);
router.get('/exam/patient', verifyToken(['patient']), ExamController.GetExamsByPatientDocument);
router.get('/exams', verifyToken(['technical']), ExamController.ListAllExams);
router.post('/exam', verifyToken(['technical']), ExamController.AddExam);
router.put('/examFile', verifyToken(['technical']), ExamController.AddExamFile);
router.get('/result/:id', verifyToken(['doctor', 'technical']), ExamController.GetExamResultById);

module.exports = router;