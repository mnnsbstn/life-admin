"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldText } from "@/components/forms/form-field-text";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  reminderSchema,
  type ReminderFormValues,
} from "@/features/reminders/schemas/reminder.schema";
import {
  createReminderAction,
  updateReminderAction,
} from "@/lib/actions/reminder-mutations";
import type { Contract, HomeItem } from "@/lib/domain/types";

interface ReminderFormProps {
  defaultValues: ReminderFormValues;
  reminderId?: string;
  homeItems: HomeItem[];
  contracts: Contract[];
}

export function ReminderForm({
  defaultValues,
  reminderId,
  homeItems,
  contracts,
}: ReminderFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues,
  });

  const linkType = form.watch("linkType");

  const onSubmit = (values: ReminderFormValues) => {
    startTransition(async () => {
      try {
        if (reminderId) {
          await updateReminderAction(reminderId, values);
        } else {
          await createReminderAction(values);
        }
      } catch {
        toast.error("Speichern fehlgeschlagen.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormFieldText control={form.control} name="title" label="Titel" />
          <FormFieldText control={form.control} name="dueDate" label="Fällig am" type="date" />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priorität</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Niedrig</SelectItem>
                    <SelectItem value="medium">Mittel</SelectItem>
                    <SelectItem value="high">Hoch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bezug</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="standalone">Allgemein</SelectItem>
                    <SelectItem value="home_item">Home Item</SelectItem>
                    <SelectItem value="contract">Vertrag</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {linkType === "home_item" ? (
            <FormField
              control={form.control}
              name="linkTargetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Item</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {homeItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {linkType === "contract" ? (
            <FormField
              control={form.control}
              name="linkTargetId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vertrag</FormLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {contracts.map((contract) => (
                        <SelectItem key={contract.id} value={contract.id}>
                          {contract.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notiz" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : reminderId ? "Änderungen speichern" : "Erinnerung anlegen"}
        </Button>
      </form>
    </Form>
  );
}
