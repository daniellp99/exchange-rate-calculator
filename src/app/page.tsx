import CurrencyForm from "@/components/CurrencyForm";
import { getCurrencySymbols } from "@/lib/utils";

export default async function Home() {
  const initialCurrencies = await getCurrencySymbols();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 md:mt-32">
      {initialCurrencies && <CurrencyForm initialData={initialCurrencies} />}
    </main>
  );
}
