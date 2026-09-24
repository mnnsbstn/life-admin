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
import { homeItemCategoryLabels } from "@/config/categories";
import {
  homeItemSchema,
  type HomeItemFormValues,
} from "@/features/home/schemas/home-item.schema";
import {
  createHomeItemAction,
  updateHomeItemAction,
} from "@/lib/actions/home-items";

interface HomeItemFormProps {
  defaultValues: HomeItemFormValues;
  itemId?: string;
}

export function HomeItemForm({ defaultValues, itemId }: HomeItemFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<HomeItemFormValues>({
    resolver: zodResolver(homeItemSchema),
    defaultValues,
  });

  const onSubmit = (values: HomeItemFormValues) => {
    startTransition(async () => {
      try {
        if (itemId) {
          await updateHomeItemAction(itemId, values);
        } else {
          await createHomeItemAction(values);
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
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategorie</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(homeItemCategoryLabels).map(([value, label]) => (
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
          <FormFieldText control={form.control} name="manufacturer" label="Hersteller" />
          <FormFieldText control={form.control} name="model" label="Modell" />
          <FormFieldText control={form.control} name="serialNumber" label="Seriennummer" />
          <FormFieldText control={form.control} name="location" label="Standort" />
          <FormFieldText control={form.control} name="purchaseDate" label="Kaufdatum" type="date" />
          <FormFieldText
            control={form.control}
            name="installationDate"
            label="Installation"
            type="date"
          />
          <FormFieldText
            control={form.control}
            name="purchasePriceEuro"
            label="Kaufpreis (€)"
            placeholder="699"
          />
          <FormFieldText
            control={form.control}
            name="warrantyEndsAt"
            label="Garantie bis"
            type="date"
          />
          <FormFieldText
            control={form.control}
            name="lastMaintenanceAt"
            label="Letzte Wartung"
            type="date"
          />
          <FormFieldText
            control={form.control}
            name="nextMaintenanceAt"
            label="Nächste Wartung"
            type="date"
          />
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : itemId ? "Änderungen speichern" : "Home Item anlegen"}
        </Button>
      </form>
    </Form>
  );
}
