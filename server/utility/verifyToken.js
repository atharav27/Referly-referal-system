import jwt from "jsonwebtoken";

export const verifyToken = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Get token from Authorization header
      const token = req.headers["authorization"]?.split(" ")[1]; // Format: "Bearer <token>"

      if (!token) {
        return res
          .status(401)
          .json({ success: false, message: "No token provided." });
      }

      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res
            .status(403)
            .json({ success: false, message: "Invalid or expired token." });
        }

        // Attach decoded user data to request object
        req.user = decoded;

        // Check if the user's role matches the required role
        if (requiredRole && decoded.role !== requiredRole) {
          return res
            .status(403)
            .json({ success: false, message: "Insufficient permissions." });
        }

        // Proceed to the next middleware or route handler
        next();
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server error." });
    }
  };
};
