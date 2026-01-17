"use client";

import { useState, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  BookOpenIcon,
  BotIcon,
  GemIcon,
  MicIcon,
  PaletteIcon,
  PhoneIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Features {
  icon: LucideIcon;
  label: string;
  description: string;
}

interface PremiumFeaturesOverlayProps {
  children: React.ReactNode;
}

const features: Features[] = [
  {
    icon: BotIcon,
    label: "AI Customer Support",
    description: "Intelligent automated responses 24/7",
  },
  {
    icon: MicIcon,
    label: "AI Voice Agents",
    description: "Natural voice conversations with customers",
  },
  {
    icon: PhoneIcon,
    label: "Phone System",
    description: "Inbound & outbound calling capabilities",
  },
  {
    icon: BookOpenIcon,
    label: "Knowledge Base",
    description: "Train AI on your documentation",
  },

  {
    icon: UsersIcon,
    label: "Team Access",
    description: "Up to 5 operators per organization",
  },

  {
    icon: PaletteIcon,
    label: "Widget Customization",
    description: "Customize Your Chat Widget appearence",
  },

];

export const PremiumFeatureOverlay = ({
  children,
}: PremiumFeaturesOverlayProps) => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Background Content */}
      <div className="pointer-events-none select-none">{children}</div>

      {/* Overlay with blur */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-black/20 flex items-center justify-center">
        {/* Upgrade Prompt */}
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
          <Card
            className={`w-full max-w-md transition-all duration-700 ${
              isVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-10 opacity-0 scale-95"
            }`}
          >
            <CardHeader className="text-center">
              <div className="flex items-center justify-center">
                <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75"></div>
                  <GemIcon className="text-white size-6 relative z-10" />
                </div>
              </div>
              <CardTitle className="text-xl">Premium Features</CardTitle>
              <CardDescription>
                This feature requires a pro subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Features List */}
              {features.map((feature, index) => (
                <div
                  key={feature.label}
                  className={`flex items-center gap-3 transition-all duration-500 ${
                    isVisible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-10 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${(index + 1) * 100}ms`,
                  }}
                >
                  <div className="flex size-8 items-center justify-center rounded-lg border bg-muted">
                    <feature.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-xs">{feature.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                className="w-full relative animate-caret-blink overflow-hidden group"
                onClick={() => {
                  alert("Redirecting to billing page...");
                  router.push("/billing");
                }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                size="lg"
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000"></div>

                <span className="relative flex items-center justify-center gap-2">
                  View Plans
                  {/* Animated pointing hand */}
                  <span
                    className={`text-lg transition-all duration-300 ${
                      hovering ? "translate-x-1 scale-110" : ""
                    }`}
                    style={{
                      animation: hovering
                        ? "none"
                        : "pointingGesture 2s ease-in-out infinite",
                    }}
                  >
                    👉
                  </span>
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes pointingGesture {
          0%,
          100% {
            transform: translateX(0) scale(1);
          }
          50% {
            transform: translateX(4px) scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};
