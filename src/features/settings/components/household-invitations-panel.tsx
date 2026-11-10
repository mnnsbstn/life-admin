"use client";

import { useState, useTransition } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HouseholdInvitation } from "@/lib/domain/types";
import {
  createHouseholdInvitationAction,
  revokeHouseholdInvitationAction,
  sendHouseholdInvitationEmailAction,
} from "@/lib/actions/household";
import { formatDisplayDate } from "@/lib/format/date";

interface HouseholdInvitationsPanelProps {
  appOrigin: string;
  invitations: HouseholdInvitation[];
  invitationEmailEnabled: boolean;
}

export function HouseholdInvitationsPanel({
  appOrigin,
  invitations,
  invitationEmailEnabled,
}: HouseholdInvitationsPanelProps) {
  const [pending, startTransition] = useTransition();
  const [inviteRole, setInviteRole] = useState<"member" | "viewer">("member");

  const copyLink = (token: string) => {
    const url = `${appOrigin}/invite/${token}`;
    void navigator.clipboard.writeText(url).then(() => {
      toast.success("Einladungslink kopiert.");
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <form
        className="grid gap-4 sm:grid-cols-2"
        action={(formData) => {
          startTransition(async () => {
            try {
              const result = await createHouseholdInvitationAction(formData);
              if (result.emailSent) {
                toast.success("Einladung erstellt und E-Mail versendet.");
              } else if (invitationEmailEnabled) {
                toast.success(
                  "Einladung erstellt. E-Mail-Versand fehlgeschlagen — Link kopieren.",
                );
              } else {
                toast.success(
                  "Einladung erstellt. E-Mail nicht konfiguriert — Link kopieren.",
                );
              }
            } catch {
              toast.error("Einladung fehlgeschlagen.");
            }
          });
        }}
      >
        <div className="grid gap-2 sm:col-span-2 sm:max-w-md">
          <Label htmlFor="invite-email">E-Mail einladen</Label>
          <Input
            id="invite-email"
            name="email"
            type="email"
            placeholder="partner@example.com"
            required
            disabled={pending}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="invite-role">Rolle</Label>
          <input type="hidden" name="role" value={inviteRole} />
          <Select
            value={inviteRole}
            onValueChange={(v) => setInviteRole(v as "member" | "viewer")}
            disabled={pending}
          >
            <SelectTrigger id="invite-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="member">Mitglied</SelectItem>
              <SelectItem value="viewer">Betrachter</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Erstellen…" : "Einladung erstellen"}
          </Button>
        </div>
      </form>

      {invitations.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {invitations.map((inv) => (
            <li
              key={inv.id}
              className="flex flex-col gap-2 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{inv.email}</p>
                <p className="text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2 font-normal">
                    {inv.role}
                  </Badge>
                  Gültig bis {formatDisplayDate(inv.expiresAt.slice(0, 10))}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyLink(inv.token)}
                >
                  <Copy className="size-4" />
                  Link kopieren
                </Button>
                {invitationEmailEnabled ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={pending}
                    onClick={() => {
                      startTransition(async () => {
                        try {
                          await sendHouseholdInvitationEmailAction(inv.id);
                          toast.success("E-Mail versendet.");
                        } catch {
                          toast.error("E-Mail konnte nicht gesendet werden.");
                        }
                      });
                    }}
                  >
                    E-Mail senden
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => {
                    startTransition(async () => {
                      try {
                        await revokeHouseholdInvitationAction(inv.id);
                        toast.success("Einladung widerrufen.");
                      } catch {
                        toast.error("Widerruf fehlgeschlagen.");
                      }
                    });
                  }}
                >
                  Widerrufen
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Keine offenen Einladungen. Neue Einladungen werden per E-Mail versendet,
          wenn Resend in Vercel konfiguriert ist — sonst Link kopieren.
        </p>
      )}
    </div>
  );
}
