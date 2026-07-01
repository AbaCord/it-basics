"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInButton() {
  return (
    <Button
      size="sm"
      className="shrink-0 gap-2 text-xs hover:cursor-pointer"
      onClick={() => authClient.signIn.social({ provider: "github" })}
    >
      Sign in with GitHub
    </Button>
  );
}
