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
import { financialAccountTypeLabels } from "@/config/financial-account-types";
import {
  financialAccountSchema,
  type FinancialAccountFormValues,
} from "@/features/money/schemas/financial-account.schema";
import {
  createFinancialAccountAction,
  updateFinancialAccountAction,
} from "@/lib/actions/money-accounts";

interface FinancialAccountFormProps {
  defaultValues: FinancialAccountFormValues;
  accountId?: string;
}

export function FinancialAccountForm({
  defaultValues,
  accountId,
}: FinancialAccountFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<FinancialAccountFormValues>({
    resolver: zodResolver(financialAccountSchema),
    defaultValues,
  });

  const onSubmit = (values: FinancialAccountFormValues) => {
    startTransition(async () => {
      try {
        if (accountId) {
          await updateFinancialAccountAction(accountId, values);
        } else {
          await createFinancialAccountAction(values);
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
          <FormFieldText control={form.control} name="name" label="Name" />
          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kontotyp</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Typ wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(financialAccountTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldText
            control={form.control}
            name="institution"
            label="Institut"
          />
          <FormFieldText
            control={form.control}
            name="ibanLast4"
            label="IBAN (letzte 4)"
            placeholder="4821"
          />
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : accountId ? "Änderungen speichern" : "Konto anlegen"}
        </Button>
      </form>
    </Form>
  );
}
