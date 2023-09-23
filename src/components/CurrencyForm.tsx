"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Label } from "@/components/ui/label";
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

export default function CurrencyForm({
  initialData,
}: {
  initialData: Currency[];
}) {
  useEffect(() => {
    setResult(undefined);
  }, []);

  const [result, setResult] = useState<SuccessConvertResponse>();

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
      const inputs = { ...values };

      const convertResponse = await convertCurrencies(inputs);

      if (convertResponse?.success) {
        setResult({
          info: convertResponse.info,
          query: convertResponse.query,
          result: convertResponse.result,
        });
      } else {
        toast({
          variant: "destructive",
          title: `Convert Error-${convertResponse?.error.code}`,
          description: `${convertResponse?.error.info}`,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Currency Converter</CardTitle>
            <CardDescription>
              Check live foreign currency exchange rates.
            </CardDescription>
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
                          disabled={isLoading}
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
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent asChild className="h-72">
                            <ScrollArea>
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
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent asChild className="h-72">
                            <ScrollArea className="h-72">
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
          <CardFooter className="flex justify-between">
            <Label>Result: {result?.result}</Label>
            <Button type="submit" disabled={isLoading}>
              Convert
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
