"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { quickAddActions } from "@/config/quick-add";

export function QuickAdd() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const runAction = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <Button
        size="sm"
        className="hidden gap-1.5 shadow-sm md:inline-flex"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
        Hinzufügen
      </Button>
      <Button
        size="icon-sm"
        className="md:hidden"
        aria-label="Hinzufügen"
        onClick={() => setOpen(true)}
      >
        <Plus className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Hinzufügen"
        description="Neues Objekt anlegen"
      >
        <CommandInput placeholder="Suchen oder Aktion wählen…" />
        <CommandList>
          <CommandEmpty>Keine Aktion gefunden.</CommandEmpty>
          <CommandGroup heading="Neu anlegen">
            {quickAddActions.map((action) => (
              <CommandItem
                key={action.id}
                value={`${action.label} ${action.description}`}
                onSelect={() => runAction(action.href)}
              >
                <action.icon className="size-4" />
                <span className="flex flex-col gap-0.5">
                  <span>{action.label}</span>
                  <span className="text-xs text-muted-foreground">
                    {action.description}
                  </span>
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Hinweis">
            <CommandItem disabled value="ai-später">
              KI-Eingabe — geplant für eine spätere Version
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
