"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

interface HintProps {
  text: string;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  alignment?: "start" | "center" | "end";
}

export const Hint = ({
  children,
  text,
  alignment = "center",
  side = "top",
}: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
