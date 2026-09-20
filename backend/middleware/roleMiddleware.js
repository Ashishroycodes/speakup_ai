/**
 * Role-Based Access Control Middleware
 */

export function requireTeacher(req, res) {
  if (!req.user || req.user.role !== 'teacher') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Teacher privileges are required to access this resource.'
    });
    return false;
  }
  return true;
}

export function requireStudent(req, res) {
  if (!req.user || req.user.role !== 'student') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Student account required.'
    });
    return false;
  }
  return true;
}
