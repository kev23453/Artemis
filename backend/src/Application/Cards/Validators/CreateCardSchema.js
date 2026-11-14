const { z } = require("zod");

const createCardSchema = z.object({
    creditLimit: z.number("Credit limit must be a number").finite("Credit limit must be a finite number").min(0, "Credit limit cannot be negative"),
    isActive: z.boolean("Is active must be a boolean").default(true),
    userId: z.string("Invalid userId format").trim().min(1, "User id is required"),
    adminId: z.string("Invalid adminId format").trim().min(1, "Admin id is required")
});

module.exports = createCardSchema;
