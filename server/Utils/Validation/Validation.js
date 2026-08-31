

const { z } = require("zod");

const signupSchema = z.object({
  name: z
    .string()
    .min(7, "Name must be at least 7 characters")
    .max(50, "Name must not exceed 50 characters")
    .trim(),

  email: z
    .string()
    .email("Invalid email address")
    .max(100)
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password is too long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[@$!%*?&#]/, "Must contain at least one special character (@$!%*?&#)")
});


export default validateSignup = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ error: err.errors });
  }
};