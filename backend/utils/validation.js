const { z } = require("zod");

const registerSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const createUrlSchema = z.object({
  title: z.string().trim().optional(),
  redirectUrl: z.string().trim().url("Must be a valid URL"),
  customUrl: z.string().trim().optional(),
  qr: z.string().optional(),
});

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: result.error.issues[0]?.message || "Invalid input",
      issues: result.error.issues,
    });
  }
  req.body = result.data;
  next();
};

module.exports = { validate, registerSchema, loginSchema, createUrlSchema };
