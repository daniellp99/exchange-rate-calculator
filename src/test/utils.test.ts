import { describe, expect, it } from "vitest";

import { convertCurrencies, getCurrencySymbols } from "@/lib/utils";
import { SuccessConvertResponse } from "@/lib/exchange-schemas";

describe("Testing list nd convert currencies", () => {
  it("getCurrencySymbols should be an object", async () => {
    expect(typeof (await getCurrencySymbols())).toBe("object");
  });

  it("should return an object of type SuccessConvertResponse if success ", async () => {
    expect(
      await convertCurrencies({
        amount: 1,
        from: "USD",
        to: "EUR",
      })
    ).toMatchObject<SuccessConvertResponse>;
  });
});
