const jwt = require("jsonwebtoken");

module.exports = {
  checkLogin: (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        message: "Harus login terlebih dahulu.",
      });
    }
  },
  checkRole: (allowedRoles) => (req, res, next) => {
    try {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: "Tidak memiliki izin.",
        });
      }
      next();
    } catch (error) {
      return res.status(500).json({
        message: "Terjadi kesalahan.",
      });
    }
  },
};
