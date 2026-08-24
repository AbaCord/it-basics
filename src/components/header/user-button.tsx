"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SignInButton } from "../sign-in-button";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type User = {
  name: string;
  image?: string | null;
  email?: string | null;
};

export function UserButton({ user }: { user: User | null }) {
  const t = useTranslations("UserButton");
  const router = useRouter();

  if (!user) {
    return <SignInButton />;
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="ring-offset-background focus-visible:ring-ring relative h-8 w-8 rounded-full p-0 focus-visible:ring-2"
        >
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src={user.image ?? undefined} alt={user.name} />
            <AvatarFallback className="bg-violet-500/10 text-xs font-semibold text-violet-600">
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-foreground text-xs font-medium">@{user.name}</p>
          {user.email && (
            <p className="text-muted-foreground truncate text-xs">
              {user.email}
            </p>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-destructive focus:text-destructive cursor-pointer gap-2"
        >
          <LogOut className="size-3.5" />
          <span className="text-xs">{t("signOut")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
