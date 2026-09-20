import { AuthController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

export default async function authRoutes(req, res, pathname) {
  const targetPath = pathname || (req.url ? new URL(req.url, 'http://localhost').pathname : '');

  if (req.method === 'POST' && targetPath === '/api/auth/register') {
    return AuthController.register(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/auth/login') {
    return AuthController.login(req, res);
  }

  if (req.method === 'GET' && targetPath === '/api/auth/me') {
    const user = await authMiddleware(req, res);
    if (!user) return;
    return AuthController.me(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/auth/forgot-password') {
    return AuthController.forgotPassword(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/auth/reset-password') {
    return AuthController.resetPassword(req, res);
  }

  if (req.method === 'POST' && targetPath === '/api/auth/change-password') {
    const user = await authMiddleware(req, res);
    if (!user) return;
    return AuthController.changePassword(req, res);
  }

  res.status(404).json({ success: false, message: 'Auth endpoint not found.' });
}
