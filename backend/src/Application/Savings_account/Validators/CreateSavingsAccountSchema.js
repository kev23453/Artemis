const { z } = require("zod")

const CreateSavingsAccountSchema = z.object({
    accountNumber: z.string().trim().regex(/^\d{9}$/, "Account number must be exactly 9 digits"),
    balance: z.number().min(0, "Balance cannot be negative"),
    userId: z.string("Invalid userId format"),
    isPrincipal: z.boolean().default(false),
    isActive: z.boolean().default(true),
    adminId: z.string("Invalid adminId format"),

})

module.exports = CreateSavingsAccountSchema;