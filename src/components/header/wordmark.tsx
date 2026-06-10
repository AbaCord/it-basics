"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Wordmark() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <Link href="/">
      <span className="text-lg font-bold tracking-tight select-none">
        <span className="text-foreground">Intro</span>
        <span className="text-violet-500">Course</span>
        <span
          className={cn(
            "ml-0.5 inline-block h-[1.1em] w-0.5 bg-violet-500 align-middle transition-opacity duration-75",
            visible ? "opacity-100" : "opacity-0",
          )}
          aria-hidden
        />
      </span>
    </Link>
  );
}
