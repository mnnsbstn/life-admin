import { getDemoContext } from "@/lib/data/demo-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProfilePage() {
  const { user, household } = getDemoContext();
  const initials = user.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="size-12">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-base font-medium">{user.displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Household: <span className="text-foreground">{household.name}</span>
        </CardContent>
      </Card>
    </div>
  );
}
