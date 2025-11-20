import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { HomeIcon, InboxIcon } from "lucide-react";
import { screenAtom } from "../../atoms/widget-atoms";

const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);

  const setScreen = useSetAtom(screenAtom);

  return (
    <footer className="flex items-center border-t border-border/50 bg-gradient-to-t from-background/95 to-background/60 backdrop-blur-sm shadow-lg">
      <Button
        className="h-14 flex-1 rounded-none hover:bg-muted/40 transition-colors duration-200"
        onClick={() => setScreen("selection")}
        variant="ghost"
        size="icon"
      >
        <HomeIcon
          className={cn(
            "size-5 transition-transform duration-200 hover:scale-105",
            screen === "selection" ? "text-primary" : "text-muted-foreground/70"
          )}
        />
      </Button>
      <Button
        className="h-14 flex-1 rounded-none hover:bg-muted/40 transition-colors duration-200"
        onClick={() => setScreen("inbox")}
        variant="ghost"
        size="icon"
      >
        <InboxIcon
          className={cn(
            "size-5 transition-transform duration-200 hover:scale-105",
            screen === "inbox" && "text-primary"
          )}
        />
      </Button>
    </footer>
  );
};

export default WidgetFooter;
