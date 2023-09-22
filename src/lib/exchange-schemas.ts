import { z } from "zod";

export const InputSchema = z.object({
  amount: z
    .number()
    .positive()
    .refine(
      (value) =>
        Number.isInteger(value) || value.toString().split(".")[1]?.length <= 2,
      {
        message: "Invalid amount provided",
      }
    ),
});

// Schema for an individual symbol
const symbolSchema = z.object({
  code: z.string().length(3),
  name: z.string(),
});

// Schema for the overall response
const symbolsResponseSchema = z.object({
  success: z.boolean(),
  symbols: z.record(symbolSchema),
});

export type Amount = z.infer<typeof InputSchema>;
export type Symbol = z.infer<typeof symbolSchema>;
export type SymbolResponse = z.infer<typeof symbolsResponseSchema>;
