import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import Icon from "./Icon";
import { ThemeToggle } from "./ThemeToggle";

export default function NavBar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-card text-card-foreground shadow-sm border rounded-md">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-start ml-2 md:mr-24 gap-2">
            <Icon name="dollar-sign" />
            <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
              Exchange Calculator
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="https://github.com/daniellp99/exchange-rate-calculator"
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={buttonVariants({
                  size: "icon",
                  variant: "ghost",
                })}
              >
                <Icon name="github" className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
