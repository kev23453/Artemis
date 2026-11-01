const { z } = require("zod");

const createBeneficiarySchema = z.object({
    firstName: z.string().trim().min(2, "First name is too short").max(50),
    lastName: z.string().trim().min(2, "Last name is too short").max(50),
    accountNumber: z.string().trim().regex(/^\d{9}$/, "Account number must be exactly 9 digits"),
    userId: z.string().trim().min(1, "User id is required"),
    active: z.boolean().default(true),
});

module.exports = createBeneficiarySchema;
