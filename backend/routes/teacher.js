import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireTeacher } from '../middleware/roleMiddleware.js';
import { TeacherController } from '../controllers/teacherController.js';

export default async function teacherRoutes(req, res, pathname) {
  const targetPath = pathname || (req.url ? new URL(req.url, 'http://localhost').pathname : '');
  const user = await authMiddleware(req, res);
  if (!user) return;

  // Strict role verification: only teachers can access teacher APIs
  if (!requireTeacher(req, res)) return;

  if (targetPath === '/api/teacher/students' && req.method === 'GET') {
    return TeacherController.getStudents(req, res);
  }

  if (targetPath.startsWith('/api/teacher/students/') && req.method === 'GET') {
    const studentId = targetPath.replace('/api/teacher/students/', '').trim();
    req.params = { id: studentId };
    return TeacherController.getStudentById(req, res);
  }

  if (targetPath === '/api/teacher/assignments') {
    if (req.method === 'POST') {
      return TeacherController.createAssignment(req, res);
    }
    if (req.method === 'GET') {
      return TeacherController.getAssignments(req, res);
    }
  }

  if (targetPath.startsWith('/api/teacher/assignments/') && req.method === 'DELETE') {
    const assignmentId = targetPath.replace('/api/teacher/assignments/', '').trim();
    req.params = { id: assignmentId };
    return TeacherController.deleteAssignment(req, res);
  }

  if (targetPath === '/api/teacher/profile') {
    if (req.method === 'GET') {
      return TeacherController.getProfile(req, res);
    }
    if (req.method === 'PUT') {
      return TeacherController.updateProfile(req, res);
    }
  }

  res.status(404).json({ success: false, message: 'Teacher endpoint not found.' });
}
