"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { quickAddItems } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useState } from "react";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button size="sm" className="gap-1.5">
            <Plus className="size-4" aria-hidden />
            Add
          </Button>
        }
      />
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogHeader className="border-b border-border/60 px-4 py-3">
          <DialogTitle>Quick add</DialogTitle>
          <DialogDescription>Create a new record in your household.</DialogDescription>
        </DialogHeader>
        <Command className="rounded-none border-0">
          <CommandInput placeholder="Search types…" />
          <CommandList>
            <CommandEmpty>No matches.</CommandEmpty>
            <CommandGroup heading="Create">
              {quickAddItems.map((item) => (
                <CommandItem
                  key={item.href}
                  value={item.label}
                  onSelect={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                >
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
