"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export function Wordmark() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <Link href="/">
      <span className="text-lg font-bold tracking-tight select-none">
        <span className="text-foreground">IT</span>
        <span className="text-red-400"> Basics</span>
        <span
          className={cn(
            "ml-0.5 inline-block h-[1.1em] w-0.5 bg-red-400 align-middle transition-opacity duration-75",
            visible ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        />
      </span>
    </Link>
  );
}
