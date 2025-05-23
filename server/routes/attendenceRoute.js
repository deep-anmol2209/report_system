import express from 'express';
import { markAttendance, getUserAttendance, getAllAttendance, updateAttendance, adminMarkAttendance } from '../controller/attendenceController.js';
import authenticateToken from '../middeleware/authMiddeleware.js';
import { genAttendancePdf } from '../utils/pdfgenerate.js';
import adminCtrl from '../controller/adminController.js';

const router = express.Router();

router.post('/mark', authenticateToken, markAttendance);
router.get('/user/:userId', authenticateToken, getUserAttendance);
router.get('/all', authenticateToken, getAllAttendance);
router.put('/:id', authenticateToken, updateAttendance);
router.post('/admin-mark', authenticateToken, adminMarkAttendance);
router.get('/generate-attendance', authenticateToken, adminCtrl.downloadattendancePdf )

export default router