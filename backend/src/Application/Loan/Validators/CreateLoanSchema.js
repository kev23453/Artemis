const { z } = require("zod");

const createLoanSchema = z.object({
  identifierNumber: z
    .string({
      required_error: "Identifier number is required",
      invalid_type_error: "Invalid identifier number format",
    })
    .trim()
    .min(1, "Identifier number is required!"),

  loanAmount: z
    .number({
      required_error: "Loan amount is required",
      invalid_type_error: "Loan amount must be a number",
    })
    .finite("Loan amount must be a finite number")
    .positive("Loan amount must be greater than 0"),

  termMonths: z
    .number({
      required_error: "Term months is required",
      invalid_type_error: "Term months must be a number",
    })
    .int("Term months must be a whole number")
    .positive("Term months must be positive"),

  interestRate: z
    .number({
      required_error: "Interest rate is required",
      invalid_type_error: "Interest rate must be a number",
    })
    .finite("Interest rate must be a finite number")
    .min(0, "Interest rate cannot be negative"),

  isActive: z
    .boolean({
      invalid_type_error: "Active status must be a boolean",
    })
    .default(true),

  paymentStatus: z
    .enum(["al dia", "retrasado"], {
      errorMap: () => ({ message: "Payment status must be 'al dia' or 'retrasado'" }),
    })
    .default("al dia"),

  userId: z
    .string({
      required_error: "User id is required",
      invalid_type_error: "Invalid userId format",
    })
    .trim()
    .min(1, "User id is required"),

  adminId: z
    .string({
      required_error: "Admin id is required",
      invalid_type_error: "Invalid adminId format",
    })
    .trim()
    .min(1, "Admin id is required"),
});

module.exports = createLoanSchema;
