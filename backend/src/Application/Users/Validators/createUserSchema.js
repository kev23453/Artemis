const { z } = require("zod");

const createUserSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required").max(50),
    lastName: z.string().trim().min(1, "Last name is required").max(50),
    username: z.string().trim().min(3, "Username must be at least 3 characters").max(30)
        .regex(/^[a-zA-Z0-9_.]+$/, "Username can only contain letters, numbers, dots and underscores"),
    identityNumber: z.string().trim().regex(/^\d{12}$/, "Identity number must be exactly 12 digits"),
    email: z.string().trim().toLowerCase().email("Invalid email format").max(100),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(64, "Password is too long")
        .regex(/[a-z]/, "password must contain at least one lowercase letter")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[#$&%@!?_*-]/, "Password must contain at least one special character"),
    phoneNumber: z.string().trim().regex(/^\+?[0-9]{7,15}$/, "Invalid phone number format"),
});

module.exports = createUserSchema;