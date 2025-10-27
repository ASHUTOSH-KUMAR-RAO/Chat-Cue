"use client";

import WidgetFooter from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

interface Props {
  organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="min-h-screen min-w-screen flex flex-col overflow-hidden rounded-xl h-full w-full border border-border/50 bg-gradient-to-br from-muted via-muted/95 to-muted/90 shadow-xl">
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6 bg-gradient-to-r from-background/50 to-transparent">
          <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text rounded-lg">
            Hi there ! 👋
          </h1>
          <p className="text-base font-medium text-muted-foreground/90">
            How can we help today..?
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 px-6 py-4 backdrop-blur-sm">
        <span className="text-sm font-medium text-muted-foreground/60">
          Widget View :- {organizationId}
        </span>
      </div>
      <WidgetFooter />
    </main>
  );
};

export default WidgetView;
