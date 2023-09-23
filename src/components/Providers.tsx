"use client";

import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

function Providers({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <NextThemesProvider {...props}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </NextThemesProvider>
  );
}

export default Providers;
