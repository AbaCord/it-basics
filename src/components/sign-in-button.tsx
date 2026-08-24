"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useTranslations } from "next-intl";

export function SignInButton() {
  const t = useTranslations("SignInButton");

  return (
    <Button
      size="sm"
      className="shrink-0 cursor-pointer gap-2 text-xs"
      onClick={() => authClient.signIn.social({ provider: "github" })}
    >
      {t("label")}
    </Button>
  );
}
