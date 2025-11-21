import { ArrowRightIcon, ArrowUpIcon, CheckIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface ConversationStatusIconProps {
  status: "unresolved" | "escalated" | "resolved";
  className?: string;
}

const statusConfig = {
  resolved: {
    icon: CheckIcon,
    bg: "bg-[#4FD390]",
    ring: "ring-[#3ab16f]/50",
  },
  unresolved: {
    icon: ArrowRightIcon,
    bg: "bg-rose-600",
    ring: "ring-rose-600/50",
  },
  escalated: {
    icon: ArrowUpIcon,
    bg: "bg-amber-400",
    ring: "ring-amber-400/50",
  },
} as const;

export const ConversationStatusIcon = ({
  status,
  className,
}: ConversationStatusIconProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center justify-center size-7 rounded-full shadow-sm",
        "ring-2 ring-offset-1 transition-all",
        config.bg,
        config.ring,
        className
      )}
    >
      <Icon className="size-3 stroke-[3] text-black" />
    </div>
  );
};
