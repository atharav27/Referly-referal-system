import jwt from "jsonwebtoken";

export const verifyRole = (requiredRole) => {
  return (req, res, next) => {
    try {
      // Get token from Authorization header
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      // Verify the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: "Invalid or expired token" });
        }
console.log(decoded.role)

console.log(requiredRole)
        // Check if the decoded token contains the required role
        if (decoded.role !== requiredRole) {
          return res.status(403).json({ message: "Insufficient permissions" });
        }
        

        // Pass the decoded user information to the next middleware/route handler
        req.user = decoded;
        next();
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
};
