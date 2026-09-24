interface ModulePlaceholderProps {
  title: string;
  description: string;
}

export function ModulePlaceholder({
  title,
  description,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-4 py-10 md:px-8">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
