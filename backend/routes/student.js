import { authMiddleware } from '../middleware/authMiddleware.js';

export default async function studentRoutes(req, res, pathname) {
  const { StudentController } = await import(`../controllers/studentController.js?t=${Date.now()}`);
  const user = await authMiddleware(req, res);
  if (!user) return;

  if (pathname === '/api/student/profile') {
    if (req.method === 'GET') {
      return StudentController.getProfile(req, res);
    }
    if (req.method === 'PUT') {
      return StudentController.updateProfile(req, res);
    }
  }

  if (pathname === '/api/student/progress/sync' && req.method === 'POST') {
    return StudentController.syncProgress(req, res);
  }

  if (pathname === '/api/student/assignments' && req.method === 'GET') {
    return StudentController.getAssignments(req, res);
  }

  res.status(404).json({ success: false, message: 'Student endpoint not found.' });
}
