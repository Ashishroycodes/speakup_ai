import { authMiddleware } from '../middleware/authMiddleware.js';
import { requireTeacher } from '../middleware/roleMiddleware.js';

export default async function teacherRoutes(req, res, pathname) {
  const { TeacherController } = await import(`../controllers/teacherController.js?t=${Date.now()}`);
  const user = await authMiddleware(req, res);
  if (!user) return;

  // Strict role verification: only teachers can access teacher APIs
  if (!requireTeacher(req, res)) return;

  if (pathname === '/api/teacher/students' && req.method === 'GET') {
    return TeacherController.getStudents(req, res);
  }

  if (pathname.startsWith('/api/teacher/students/') && req.method === 'GET') {
    const studentId = pathname.replace('/api/teacher/students/', '').trim();
    req.params = { id: studentId };
    return TeacherController.getStudentById(req, res);
  }

  if (pathname === '/api/teacher/assignments') {
    if (req.method === 'POST') {
      return TeacherController.createAssignment(req, res);
    }
    if (req.method === 'GET') {
      return TeacherController.getAssignments(req, res);
    }
  }

  if (pathname.startsWith('/api/teacher/assignments/') && req.method === 'DELETE') {
    const assignmentId = pathname.replace('/api/teacher/assignments/', '').trim();
    req.params = { id: assignmentId };
    return TeacherController.deleteAssignment(req, res);
  }

  if (pathname === '/api/teacher/profile') {
    if (req.method === 'GET') {
      return TeacherController.getProfile(req, res);
    }
    if (req.method === 'PUT') {
      return TeacherController.updateProfile(req, res);
    }
  }

  res.status(404).json({ success: false, message: 'Teacher endpoint not found.' });
}
