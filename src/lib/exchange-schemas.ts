import { z } from "zod";

export const InputSchema = z.object({
  amount: z.coerce
    .number()
    .positive()
    .refine(
      (value) =>
        Number.isInteger(value) || value.toString().split(".")[1]?.length <= 2,
      {
        message: "Invalid amount provided",
      }
    ),
  from: z.string().length(3),
  to: z.string().length(3),
});
const currencies = z.record(z.string().length(3), z.string());
const error = z.object({
  code: z.number(),
  info: z.string(),
});

export const getCurrenciesResponse = z.discriminatedUnion("success", [
  z.object({ success: z.literal(true), currencies }),
  z.object({ success: z.literal(false), error }),
]);

export const convertCurrenciesResponse = z.discriminatedUnion("success", [
  z.object({
    success: z.literal(true),
    result: z.number(),
    info: z.object({ quote: z.number(), timestamp: z.number() }),
    query: z.object({ amount: z.number(), from: z.string(), to: z.string() }),
  }),
  z.object({ success: z.literal(false), error }),
]);

const currencySchema = z.object({
  code: currencies.keySchema,
  name: currencies.valueSchema,
});

export type InputRequest = z.infer<typeof InputSchema>;
export type Currency = z.infer<typeof currencySchema>;
export type SuccessConvertResponse = z.infer<
  typeof convertCurrenciesResponse
> extends infer U
  ? U extends { success: true }
    ? Omit<U, "success">
    : never
  : never;
