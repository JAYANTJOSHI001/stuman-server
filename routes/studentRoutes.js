import express from 'express';
import {
  getAllStudents, addStudent, updateStudent,
  deleteStudent, syncStudentData, getStudentPro
} from '../controllers/studentController.js';

const router = express.Router();

router.get('/students', getAllStudents);
router.post('/students', addStudent);
router.put('/students/:id', updateStudent);
router.delete('/students/:id', deleteStudent);
router.get('/students/:id/pro', getStudentPro);
router.post('/sync', syncStudentData);

export default router;
