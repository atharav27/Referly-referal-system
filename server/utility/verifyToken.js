import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers['authorization']?.split(' ')[1]; // Format: "Bearer <token>"
// console.error(token);
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided." });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token." });
      }

      req.user = decoded; // Attach decoded user data to request object
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
