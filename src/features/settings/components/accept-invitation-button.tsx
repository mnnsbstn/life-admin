"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { acceptHouseholdInvitationAction } from "@/lib/actions/household";

interface AcceptInvitationButtonProps {
  token: string;
}

export function AcceptInvitationButton({ token }: AcceptInvitationButtonProps) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await acceptHouseholdInvitationAction(token);
          } catch {
            toast.error("Einladung konnte nicht angenommen werden.");
          }
        });
      }}
    >
      {pending ? "Wird beigetreten…" : "Einladung annehmen"}
    </Button>
  );
}
