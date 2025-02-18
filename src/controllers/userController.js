const jwt = require("jsonwebtoken");

exports.getProfile = (req, res) => {

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
