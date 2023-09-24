import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import {
  Currency,
  InputRequest,
  convertCurrenciesResponse,
  getCurrenciesResponse,
} from "./exchange-schemas";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BASE_URL = "https://api.apilayer.com/currency_data/";

const myHeaders = new Headers();
myHeaders.append("apikey", `XCJn4eow7CqAlxZvbVh0Q6rZZShhskNK`);

const requestOptions = {
  method: "GET",
  redirect: "follow" as const,
  headers: myHeaders,
};

export async function getCurrencySymbols() {
  try {
    const res = await fetch(`${BASE_URL}list`, requestOptions);

    const data = await res.json();

    const response = getCurrenciesResponse.parse(data);

    if (response.success) {
      const symbols = Object.entries(response.currencies).map(
        ([key, value]) => {
          const currentSymbol: Currency = {
            code: key,
            name: value,
          };
          return currentSymbol;
        }
      );
      return symbols;
    } else {
      throw new Error(
        `Something went wrong. Error${response.error.code}: ${response.error.info}`
      );
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      throw new Error(
        `Something went wrong with the response. Error: ${errors}`
      );
    }
  }
}

export async function convertCurrencies(inputs: InputRequest) {
  const { amount, from, to } = inputs;
  try {
    const res = await fetch(
      `${BASE_URL}convert?to=${to}&from=${from}&amount=${amount}`,
      requestOptions
    );

    const data = await res.json();
    console.log("🚀 ~ file: utils.ts:69 ~ convertCurrencies ~ data:", data);

    const convertCurrencies = convertCurrenciesResponse.parse(data);

    return convertCurrencies;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => issue.message);
      throw new Error(
        `Something went wrong with the response. Error: ${errors}`
      );
    }
  }
}
