export default async function userRoutes(req, res, pathname) {
  const { UserController } = await import(`../controllers/userController.js?t=${Date.now()}`);

  if (req.method === 'GET' && (pathname === '/api/users' || pathname === '/api/users/')) {
    return UserController.getAllUsers(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/users/forgot-password') {
    return UserController.requestPasswordReset(req, res);
  }

  if (req.method === 'POST' && pathname === '/api/users/reset-password') {
    return UserController.executePasswordReset(req, res);
  }

  // Route: GET /api/users/:id
  if (req.method === 'GET' && pathname.startsWith('/api/users/')) {
    const userId = pathname.replace('/api/users/', '').trim();
    if (userId && !userId.includes('/')) {
      return UserController.getUserById(req, res, userId);
    }
  }

  res.status(404).json({ success: false, message: 'Users API endpoint not found.' });
}
