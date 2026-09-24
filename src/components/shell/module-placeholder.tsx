interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export function ModulePlaceholder({
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <div className="flex flex-col gap-2 py-2">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
