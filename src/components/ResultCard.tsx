import { SuccessConvertResponse } from "@/lib/exchange-schemas";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { buttonVariants } from "./ui/button";

export default function ResultCard({
  conversionResult,
}: {
  conversionResult: SuccessConvertResponse | undefined;
}) {
  if (conversionResult === undefined)
    return <Skeleton className="w-[300px] h-[110px]" />;
  const { query, result } = conversionResult;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Result</CardTitle>
        <CardTitle className="text-sm font-medium text-primary">
          {query.from} - {query.to}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{result}</div>
      </CardContent>
    </Card>
  );
}
