import { UserController } from '../controllers/userController.js';

export default async function userRoutes(req, res, pathname) {
  const targetPath = pathname || (req.url ? new URL(req.url, 'http://localhost').pathname : '');

  if (req.method === 'GET' && (targetPath === '/api/users' || targetPath === '/api/users/')) {
    return UserController.getAllUsers(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/users/forgot-password') {
    return UserController.requestPasswordReset(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/users/reset-password') {
    return UserController.executePasswordReset(req, res);
  }

  // Route: GET /api/users/:id
  if (req.method === 'GET' && targetPath.startsWith('/api/users/')) {
    const userId = targetPath.replace('/api/users/', '').trim();
    if (userId && !userId.includes('/')) {
      return UserController.getUserById(req, res, userId);
    }
  }

  res.status(404).json({ success: false, message: 'Users API endpoint not found.' });
}
