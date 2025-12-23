"use client";

import { Button } from "@workspace/ui/components/button";
import { ArrowLeftRightIcon, type LucideIcon, PlugIcon } from "lucide-react";

import Image from "next/image";

export interface Feature {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const PluginCard = ({
  features,
  onSubmit,
  serviceImage,
  serviceName,
  isDisabled,
}: {
  isDisabled?: boolean;
  serviceName: string;
  serviceImage: string;
  features: Feature[];
  onSubmit: () => void;
}) => {
  return (
    <div className="h-fit w-full overflow-hidden rounded-xl border bg-card shadow-lg transition-shadow hover:shadow-xl">
      {/* Header Section with Images */}
      <div className="border-b bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 px-8 py-10">
        <div className="flex items-center justify-center gap-8">
          {/* Service Image */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/20 blur-xl" />
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-xl border-2 border-primary/20 bg-background shadow-lg">
              <Image
                alt={serviceName}
                className="object-contain p-2"
                height={48}
                width={48}
                src={serviceImage}
              />
            </div>
          </div>

          {/* Arrow Icon */}
          <div className="flex flex-col items-center">
            <div className="rounded-full bg-primary/10 p-3">
              <ArrowLeftRightIcon className="size-6 text-primary" />
            </div>
          </div>

          {/* Platform Image */}
          <div className="relative">
            <div className="absolute inset-0 animate-pulse rounded-xl bg-primary/20 blur-xl" />
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-xl border-2 border-primary/20 bg-background shadow-lg">
              <Image
                alt="Platform"
                className="object-contain p-2"
                height={48}
                width={48}
                src="/avatar.svg"
              />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-6 text-center">
          <h3 className="text-xl font-semibold">
            Connect your {serviceName} account
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Integrate seamlessly with {serviceName}
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="p-8">
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              className="group flex items-start gap-4 rounded-lg border bg-muted/30 p-4 transition-all hover:bg-muted/50 hover:shadow-md"
              key={feature.label}
              style={{
                animation: `fadeIn 0.3s ease-in ${index * 0.1}s backwards`,
              }}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">
                  {feature.label}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {feature.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Connect Button */}
      <div className="border-t bg-muted/30 p-6">
        <Button
          className="h-11 w-full gap-2 shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30"
          disabled={isDisabled}
          onClick={onSubmit}
          size="lg"
        >
          <PlugIcon className="size-4" />
          Connect to {serviceName}
        </Button>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
