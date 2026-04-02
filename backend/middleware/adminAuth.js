const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const token = req.header("x-auth-token") || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "promate_secret_key");
        
        // Check if the role is admin
        if (decoded.user && decoded.user.role === 'admin') {
            req.user = decoded.user;
            next();
        } else {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }
    } catch (err) {
        res.status(401).json({ message: "Token is not valid" });
    }
};
