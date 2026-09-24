"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/actions/auth";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={() => startTransition(() => signOutAction())}
    >
      {pending ? "Abmelden…" : "Abmelden"}
    </Button>
  );
}
