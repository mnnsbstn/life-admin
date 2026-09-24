export default function AppLoading() {
  return (
    <div className="flex flex-col gap-6 py-2 animate-pulse">
      <div className="h-8 w-48 rounded-md bg-muted" />
      <div className="h-4 w-72 max-w-full rounded-md bg-muted/70" />
      <div className="space-y-3 pt-4">
        <div className="h-24 rounded-xl bg-muted/60" />
        <div className="h-24 rounded-xl bg-muted/60" />
        <div className="h-24 rounded-xl bg-muted/60" />
      </div>
    </div>
  );
}
