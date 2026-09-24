type GreetingProps = {
  displayName: string;
  attentionCount: number;
};

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export function Greeting({ displayName, attentionCount }: GreetingProps) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
        {timeOfDayGreeting()}, {displayName}.
      </h2>
      <p className="text-sm text-muted-foreground">
        {attentionCount === 0
          ? "You're all caught up for now."
          : `${attentionCount} thing${attentionCount === 1 ? "" : "s"} need your attention.`}
      </p>
    </div>
  );
}
