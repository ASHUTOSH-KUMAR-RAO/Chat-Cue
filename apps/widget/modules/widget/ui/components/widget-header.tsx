import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl text-white",
        className
      )}
    >
      {children}
    </header>
  );
};
