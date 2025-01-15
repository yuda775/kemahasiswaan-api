const prisma = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await prisma.admin.findUnique({
        where: { email },
      });
      if (!admin || !(await bcrypt.compare(password, admin.password))) {
        return res.status(401).json({
          message: "Invalid email or password.",
        });
      }
      const token = jwt.sign(
        { id: admin.id, email: admin.email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "30h" }
      );
      res.json({
        data: { token },
        message: "Login successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error logging in.",
      });
    }
  },
  createAdmin: async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const [existingAdmin, existingEmail] = await Promise.all([
        prisma.admin.findUnique({ where: { email } }),
        prisma.admin.findUnique({ where: { email } }),
      ]);
      if (existingAdmin || existingEmail) {
        return res.status(400).json({
          message: "Admin or email already exists.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      res.status(201).json({
        data: newAdmin,
        message: "Admin created successfully.",
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
        message: "Error creating admin.",
      });
    }
  },
};
