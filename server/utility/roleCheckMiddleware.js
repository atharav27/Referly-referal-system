import jwt from "jsonwebtoken";

export const roleCheckMiddleware = async (req, res, next) => {
  try {
    // Extract the token from the headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is missing",
      });
    }

    // Verify the token and extract payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check user role
    if (decoded.role === "admin") {
      return res.status(200).json({
        success: true,
        message: "Welcome, Admin!",
      });
    }

    if (decoded.role === "user") {
      // Attach user info to the request object (optional, for further use)
      req.user = { id: decoded.id, role: decoded.role };

      // Proceed to the next middleware or route handler
      return next();
    }

    // Handle other roles (if applicable)
    return res.status(403).json({
      success: false,
      message: "Access denied. Invalid role.",
    });
  } catch (error) {
    console.error("Role check error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
