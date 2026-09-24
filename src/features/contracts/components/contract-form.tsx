"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { FormFieldText } from "@/components/forms/form-field-text";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { contractCategoryLabels } from "@/config/categories";
import { paymentIntervalOptions } from "@/config/payment-intervals";
import {
  contractSchema,
  type ContractFormValues,
} from "@/features/contracts/schemas/contract.schema";
import {
  createContractAction,
  updateContractAction,
} from "@/lib/actions/contracts";

interface ContractFormProps {
  defaultValues: ContractFormValues;
  contractId?: string;
}

export function ContractForm({ defaultValues, contractId }: ContractFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractSchema),
    defaultValues,
  });

  const onSubmit = (values: ContractFormValues) => {
    startTransition(async () => {
      try {
        if (contractId) {
          await updateContractAction(contractId, values);
        } else {
          await createContractAction(values);
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
          <FormFieldText control={form.control} name="provider" label="Anbieter" />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategorie</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(contractCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldText control={form.control} name="costEuro" label="Kosten (€)" />
          <FormField
            control={form.control}
            name="paymentInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zahlungsintervall</FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Optional" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {paymentIntervalOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormFieldText control={form.control} name="startDate" label="Vertragsbeginn" type="date" />
          <FormFieldText
            control={form.control}
            name="minimumTermMonths"
            label="Mindestlaufzeit (Monate)"
          />
          <FormFieldText
            control={form.control}
            name="noticePeriodDays"
            label="Kündigungsfrist (Tage)"
          />
          <FormFieldText
            control={form.control}
            name="nextCancellationDate"
            label="Nächstes Kündigungsdatum"
            type="date"
          />
          <FormFieldText
            control={form.control}
            name="contractEndDate"
            label="Vertragsende"
            type="date"
          />
          <FormField
            control={form.control}
            name="autoRenewal"
            render={({ field }) => (
              <FormItem className="flex items-center gap-3 space-y-0 sm:col-span-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="font-normal">Automatische Verlängerung</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : contractId ? "Änderungen speichern" : "Vertrag anlegen"}
        </Button>
      </form>
    </Form>
  );
}
