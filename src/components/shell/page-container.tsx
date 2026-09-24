import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "narrow";
}

export function PageContainer({
  children,
  className,
  size = "default",
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 py-8 md:px-8 md:py-10",
        size === "default" ? "max-w-3xl" : "max-w-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
