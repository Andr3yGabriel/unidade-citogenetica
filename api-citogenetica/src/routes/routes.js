const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const ExamController = require('../controllers/ExamController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/auth/register', UserController.Register);
router.post('/auth/login', UserController.Login);

router.get('/pacient/:document', verifyToken([1, 2, 3]), UserController.FindUserByDocument);
router.get('/exam/doctor', verifyToken([2]), ExamController.ListExamsByDoctorDocument);
router.get('/exam/patient', verifyToken([1]), ExamController.GetExamsByPatientDocument);
router.get('/exams', verifyToken([3]), ExamController.ListAllExams);
router.post('/exam', verifyToken([3]), ExamController.AddExam);
router.put('/examFile', verifyToken([3]), ExamController.AddExamFile);
router.get('/result/:id', verifyToken([2, 3]), ExamController.GetExamResultById);

module.exports = router;