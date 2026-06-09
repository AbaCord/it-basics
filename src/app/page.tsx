"use client";

import { authClient } from "@/lib/auth-client";

export default function Home() {
  return (
    <>
      <button
        onClick={() => {
          authClient.signIn.social({
            provider: "github",
          });
        }}
      >
        Click me
      </button>
      <button
        onClick={() => {
          authClient.signOut();
        }}
      >
        Log out
      </button>
    </>
  );
}
