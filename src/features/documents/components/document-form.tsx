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
import { documentTypeOptions } from "@/config/document-types";
import {
  documentSchema,
  type DocumentFormValues,
} from "@/features/documents/schemas/document.schema";
import {
  createDocumentAction,
  updateDocumentAction,
} from "@/lib/actions/documents";
import type { Contract, HomeItem } from "@/lib/domain/types";

interface DocumentFormProps {
  defaultValues: DocumentFormValues;
  documentId?: string;
  homeItems: HomeItem[];
  contracts: Contract[];
}

export function DocumentForm({
  defaultValues,
  documentId,
  homeItems,
  contracts,
}: DocumentFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
    defaultValues,
  });

  const linkType = form.watch("linkType");

  const onSubmit = (values: DocumentFormValues) => {
    startTransition(async () => {
      try {
        if (documentId) {
          await updateDocumentAction(documentId, values);
        } else {
          await createDocumentAction(values);
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
          <FormField
            control={form.control}
            name="documentType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Typ</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {documentTypeOptions.map((opt) => (
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
          <FormFieldText control={form.control} name="issuedAt" label="Datum" type="date" />
          <FormFieldText
            control={form.control}
            name="mockFileName"
            label="Dateiname (Demo)"
            placeholder="rechnung.pdf"
          />
          <FormField
            control={form.control}
            name="linkType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verknüpfung</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Keine</SelectItem>
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
                        <SelectValue placeholder="Wählen" />
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
                        <SelectValue placeholder="Wählen" />
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
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : documentId ? "Änderungen speichern" : "Dokument anlegen"}
        </Button>
      </form>
    </Form>
  );
}
