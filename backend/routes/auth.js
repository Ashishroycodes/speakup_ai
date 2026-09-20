export default async function authRoutes(req, res, pathname) {
  const { AuthController } = await import(`../controllers/authController.js?t=${Date.now()}`);
  const { authMiddleware } = await import(`../middleware/authMiddleware.js?t=${Date.now()}`);

  if (req.method === 'POST' && pathname === '/api/auth/register') {
    return AuthController.register(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/auth/login') {
    return AuthController.login(req, res);
  }

  if (req.method === 'GET' && pathname === '/api/auth/me') {
    const user = await authMiddleware(req, res);
    if (!user) return;
    return AuthController.me(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/auth/forgot-password') {
    return AuthController.forgotPassword(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/auth/reset-password') {
    return AuthController.resetPassword(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/auth/change-password') {
    const user = await authMiddleware(req, res);
    if (!user) return;
    return AuthController.changePassword(req, res);
  }

  res.status(404).json({ success: false, message: 'Auth endpoint not found.' });
}
