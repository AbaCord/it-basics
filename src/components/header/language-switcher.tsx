"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Languages } from "lucide-react";
import { routing } from "@/i18n/routing";

const locales: Record<(typeof routing.locales)[number], string> = {
  en: "English",
  no: "Norsk",
} as const;

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function changeLocale(nextLocale: keyof typeof locales) {
    router.replace(pathname, { locale: nextLocale });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foregroud gap-2 text-xs"
        >
          <Languages className="size-3.5" />
          <span className="hidden sm:inline">
            {locales[locale as keyof typeof locales] ?? locale}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {Object.entries(locales).map(([value, label]) => (
          <DropdownMenuItem
            key={value}
            onClick={() => changeLocale(value as keyof typeof locales)}
            className="cursor-pointer text-xs"
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
