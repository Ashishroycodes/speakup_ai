import { authMiddleware } from '../middleware/authMiddleware.js';
import { StudentController } from '../controllers/studentController.js';

export default async function studentRoutes(req, res, pathname) {
  const targetPath = pathname || (req.url ? new URL(req.url, 'http://localhost').pathname : '');
  const user = await authMiddleware(req, res);
  if (!user) return;

  if (targetPath === '/api/student/profile') {
    if (req.method === 'GET') {
      return StudentController.getProfile(req, res);
    }
    if (req.method === 'PUT') {
      return StudentController.updateProfile(req, res);
    }
  }

  if (targetPath === '/api/student/progress/sync' && req.method === 'POST') {
    return StudentController.syncProgress(req, res);
  }

  if (targetPath === '/api/student/assignments' && req.method === 'GET') {
    return StudentController.getAssignments(req, res);
  }

  res.status(404).json({ success: false, message: 'Student endpoint not found.' });
}
