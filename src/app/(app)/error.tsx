"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-16 text-center">
      <h1 className="text-xl font-semibold">Seite konnte nicht geladen werden</h1>
      <p className="text-sm text-muted-foreground">
        {error.message ||
          "Ein Serverfehler ist aufgetreten. Bitte erneut anmelden oder die Seite neu laden."}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Erneut versuchen
        </Button>
        <Button type="button" asChild>
          <a href="/login">Zur Anmeldung</a>
        </Button>
      </div>
    </div>
  );
}
