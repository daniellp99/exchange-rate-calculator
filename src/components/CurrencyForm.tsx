"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import {
  Currency,
  InputRequest,
  InputSchema,
  SuccessConvertResponse,
} from "@/lib/exchange-schemas";
import { convertCurrencies, getCurrencySymbols } from "@/lib/utils";
import ResultCard from "./ResultCard";

export default function CurrencyForm({
  initialData,
}: {
  initialData: Currency[];
}) {
  useEffect(() => {
    setConversionResult(undefined);
  }, []);

  const [isConverting, setIsConverting] = useState(false);
  const [conversionResult, setConversionResult] =
    useState<SuccessConvertResponse>();

  const { data: currencies, isLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencySymbols,
    initialData: initialData,
    staleTime: 60 * 1000 * 10, // valid for 10 minutes
  });

  const form = useForm<InputRequest>({
    resolver: zodResolver(InputSchema),
    defaultValues: {
      amount: 0,
      from: "USD",
      to: "EUR",
    },
  });

  const fromToSelection = form.watch(["from", "to"]);

  async function onSubmit(values: InputRequest) {
    try {
      setIsConverting(true);
      const inputs = { ...values };

      const convertResponse = await convertCurrencies(inputs);
      if (convertResponse) {
        if (convertResponse.success) {
          setConversionResult({
            info: convertResponse.info,
            query: convertResponse.query,
            result: convertResponse.result,
          });
        } else {
          toast({
            variant: "destructive",
            title: `Convert Error-${convertResponse.error.code}`,
            description: `${convertResponse.error.info}`,
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Internal Server Error",
          description: "Please try again letter",
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsConverting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Currency Converter</CardTitle>
            <CardDescription>Check live currency exchange.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="0"
                          type="number"
                          {...field}
                          disabled={isLoading || isConverting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="from"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From</FormLabel>
                        <Select
                          {...field}
                          onValueChange={(value) =>
                            field.onChange(value as any)
                          }
                          defaultValue={field.value}
                          disabled={isLoading || isConverting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-64 w-72">
                              {currencies?.map((currency) => {
                                if (currency.code === fromToSelection[1]) {
                                  return null;
                                }
                                return (
                                  <SelectItem
                                    key={currency.code}
                                    value={currency.code}
                                  >
                                    {currency.code} - {currency.name}
                                  </SelectItem>
                                );
                              })}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <FormField
                    control={form.control}
                    name="to"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To</FormLabel>
                        <Select
                          {...field}
                          onValueChange={(value) =>
                            field.onChange(value as any)
                          }
                          defaultValue={field.value}
                          disabled={isLoading || isConverting}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <ScrollArea className="h-64 w-72">
                              {currencies?.map((currency) => {
                                if (currency.code === fromToSelection[0]) {
                                  return null;
                                }
                                return (
                                  <SelectItem
                                    key={currency.code}
                                    value={currency.code}
                                  >
                                    {currency.code} - {currency.name}
                                  </SelectItem>
                                );
                              })}
                            </ScrollArea>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-3">
            <ResultCard conversionResult={conversionResult} />
            <Button type="submit" disabled={isLoading || isConverting}>
              Convert
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
