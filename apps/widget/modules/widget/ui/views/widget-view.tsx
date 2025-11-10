"use client";

import { WidgetAuthScreen } from "@/modules/widget/ui/screens/widget-auth-screen";

interface Props {
  organizationId: string;
}

const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="min-h-screen min-w-screen flex flex-col overflow-hidden rounded-xl h-full w-full border border-border/50 bg-gradient-to-br from-muted via-muted/95 to-muted/90 shadow-xl">
      <WidgetAuthScreen />
    </main>
  );
};

export default WidgetView;
