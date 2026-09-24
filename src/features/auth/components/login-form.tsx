"use client";

import { useState } from "react";

import { signInAction, signUpAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  nextPath: string;
  errorMessage?: string;
}

export function LoginForm({ nextPath, errorMessage }: LoginFormProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">Life Admin</h1>
        <p className="text-sm text-muted-foreground">
          {mode === "signin" ? "Melde dich an" : "Erstelle dein Konto"}
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {errorMessage}
        </p>
      ) : null}

      <form
        action={mode === "signin" ? signInAction : signUpAction}
        className="space-y-4"
      >
        <input type="hidden" name="next" value={nextPath} />

        {mode === "signup" ? (
          <div className="space-y-2">
            <Label htmlFor="displayName">Name</Label>
            <Input id="displayName" name="displayName" autoComplete="name" />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="email">E-Mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete={
              mode === "signin" ? "current-password" : "new-password"
            }
          />
        </div>

        <Button type="submit" className="w-full">
          {mode === "signin" ? "Anmelden" : "Registrieren"}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "signin" ? (
          <>
            Noch kein Konto?{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={() => setMode("signup")}
            >
              Registrieren
            </button>
          </>
        ) : (
          <>
            Bereits registriert?{" "}
            <button
              type="button"
              className="font-medium text-foreground underline-offset-4 hover:underline"
              onClick={() => setMode("signin")}
            >
              Anmelden
            </button>
          </>
        )}
      </p>
    </div>
  );
}
