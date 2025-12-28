"use client";

import { api } from "@workspace/backend/_generated/api";
import { Loader2Icon } from "lucide-react";
import { CustomizationForm } from "../components/customization-form";
import { useQuery } from "convex/react";

export const CustomizationView = () => {
  const widgetSettings = useQuery(api.private.widgetSettings.getOne);
  const vapiPlugin = useQuery(api.private.plugins.getOne, { service: "vapi" });

  if (widgetSettings === undefined || vapiPlugin === undefined) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted p-8 gap-y-8">
        <Loader2Icon className="text-muted-foreground animate-spin" />
        <p className="text-muted-foreground text-sm">Loading Settings...</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Widget Customization
          </h1>
          <p className="mt-2 text-base text-muted-foreground md:text-lg">
            Personalize the appearance and behavior of your chat widget to match
            your brand and enhance user experience.
          </p>
        </div>
        <div className="mt-8">
          <CustomizationForm initialData={widgetSettings} hasVapiPlugin={!!vapiPlugin} />
        </div>
      </div>
    </div>
  );
};
