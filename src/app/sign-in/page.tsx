"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  useEffect(() => {
    authClient.signIn.social({
      provider: "github",
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <p>Redirecting you to GitHub to sign in ... </p>
      <button
        onClick={() => authClient.signIn.social({ provider: "github" })}
        className="mt-4 text-blue-500 underline"
      >
        Not redirected? Click here
      </button>
    </div>
  );
}
