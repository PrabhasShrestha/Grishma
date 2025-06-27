// middleware/authguard.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_TOKEN;

const authGuard = (req, res, next) => {
    console.log('authGuard middleware called'); // Debug log
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "authorization token missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "invalid or expired token" });
    }
};

module.exports = authGuard; // Default export