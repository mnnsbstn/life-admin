import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium">Settings</CardTitle>
          <CardDescription>Household and theme preferences coming in a later version.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          V0.1 uses light mode only with demo household data.
        </CardContent>
      </Card>
    </div>
  );
}
