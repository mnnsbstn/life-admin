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
import { familyRelationshipLabels } from "@/config/family-relationships";
import {
  familyMemberSchema,
  type FamilyMemberFormValues,
} from "@/features/family/schemas/family-member.schema";
import {
  createFamilyMemberAction,
  updateFamilyMemberAction,
} from "@/lib/actions/family-members";

interface FamilyMemberFormProps {
  defaultValues: FamilyMemberFormValues;
  memberId?: string;
}

export function FamilyMemberForm({ defaultValues, memberId }: FamilyMemberFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<FamilyMemberFormValues>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues,
  });

  const onSubmit = (values: FamilyMemberFormValues) => {
    startTransition(async () => {
      try {
        if (memberId) {
          await updateFamilyMemberAction(memberId, values);
        } else {
          await createFamilyMemberAction(values);
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
            name="relationship"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beziehung</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Beziehung wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(familyRelationshipLabels).map(
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
          <FormFieldText control={form.control} name="email" label="E-Mail" />
          <FormFieldText control={form.control} name="phone" label="Telefon" />
          <FormFieldText
            control={form.control}
            name="birthday"
            label="Geburtstag"
            type="date"
          />
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending
            ? "Speichern…"
            : memberId
              ? "Änderungen speichern"
              : "Kontakt anlegen"}
        </Button>
      </form>
    </Form>
  );
}
