import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import { SuccessConvertResponse } from "@/lib/exchange-schemas";

export default function ResultCard({
  conversionResult,
}: {
  conversionResult: SuccessConvertResponse | undefined;
}) {
  if (conversionResult === undefined)
    return <Skeleton className="w-[300px] h-[110px]" />;
  const { query, result } = conversionResult;
  return (
    <Card className="w-[300px] h-[110px]">
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
