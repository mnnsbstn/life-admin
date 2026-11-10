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
import { vehicleKindLabels } from "@/config/vehicle-kinds";
import {
  vehicleSchema,
  type VehicleFormValues,
} from "@/features/vehicles/schemas/vehicle.schema";
import {
  createVehicleAction,
  updateVehicleAction,
} from "@/lib/actions/vehicles";

interface VehicleFormProps {
  defaultValues: VehicleFormValues;
  vehicleId?: string;
}

export function VehicleForm({ defaultValues, vehicleId }: VehicleFormProps) {
  const [pending, startTransition] = useTransition();
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues,
  });

  const onSubmit = (values: VehicleFormValues) => {
    startTransition(async () => {
      try {
        if (vehicleId) {
          await updateVehicleAction(vehicleId, values);
        } else {
          await createVehicleAction(values);
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
            name="kind"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Art</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Art wählen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(vehicleKindLabels).map(([value, label]) => (
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
          <FormFieldText control={form.control} name="make" label="Marke" />
          <FormFieldText control={form.control} name="model" label="Modell" />
          <FormFieldText
            control={form.control}
            name="licensePlate"
            label="Kennzeichen"
          />
          <FormFieldText
            control={form.control}
            name="year"
            label="Baujahr"
            placeholder="2022"
          />
          <FormFieldText
            control={form.control}
            name="nextInspectionAt"
            label="Nächste HU"
            type="date"
          />
          <FormFieldText
            control={form.control}
            name="insuranceEndsAt"
            label="Versicherung bis"
            type="date"
          />
        </div>
        <FormFieldTextarea control={form.control} name="notes" label="Notizen" />
        <Button type="submit" disabled={pending}>
          {pending ? "Speichern…" : vehicleId ? "Änderungen speichern" : "Fahrzeug anlegen"}
        </Button>
      </form>
    </Form>
  );
}
