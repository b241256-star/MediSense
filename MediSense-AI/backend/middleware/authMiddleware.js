// ============================================================
//  MIDDLEWARE/AUTHMIDDLEWARE.JS — JWT Token Verification
//  This runs BEFORE any protected route handler.
//  If the token is valid, the request continues.
//  If not, a 401 Unauthorized error is returned.
// ============================================================

const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;

  // ---- Check if the Authorization header exists and starts with "Bearer" ----
  // Format: "Authorization: Bearer eyJhbGci..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      // Extract just the token part (after "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      // If invalid or expired, this throws an error
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_change_this'
      );

      // Attach the user ID to the request so controllers can use it
      // e.g., req.user.id = 5
      req.user = { id: decoded.id };

      next(); // ← Token is valid! Continue to the route handler.

    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired. Please log in again.' });
      }
      return res.status(401).json({ message: 'Invalid token. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in first.' });
  }
};

module.exports = { protect };
