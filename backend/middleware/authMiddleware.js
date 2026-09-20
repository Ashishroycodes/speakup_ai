import { verifyToken } from '../utils/security.js';
import { UserModel } from '../models/User.js';

/**
 * Authentication Middleware: Verifies Bearer JWT token and hydrates req.user
 */
export async function authMiddleware(req, res) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in.'
    });
    return null;
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyToken(token);

  if (!payload || !payload.id) {
    res.status(401).json({
      success: false,
      message: 'Your session has expired or is invalid. Please sign in again.'
    });
    return null;
  }

  const user = await UserModel.findById(payload.id);
  if (!user) {
    res.status(401).json({
      success: false,
      message: 'User account not found.'
    });
    return null;
  }

  req.user = user;
  return user;
}
