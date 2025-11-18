"use client";

import { useAtomValue } from "jotai";
import { AlertTriangle } from "lucide-react";
import { errorMessageAtom } from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";

// Black & White Particle Component
const Particle = ({ delay }: { delay: number }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });
  const isWhite = Math.random() > 0.5;
  const size = Math.random() * 4 + 2;

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPosition({
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      },
      8000 + Math.random() * 4000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute rounded-full ${isWhite ? "bg-white" : "bg-black"} opacity-20 blur-[1px]`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: `all ${8 + Math.random() * 4}s ease-in-out`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
};

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Black & White Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} delay={i * 150} />
        ))}
      </div>

      {/* Header using WidgetHeader Component */}
      <WidgetHeader className="relative z-10">
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6">
          <h1 className="text-xl font-semibold tracking-tight text-white animate-in fade-in slide-in-from-top-4 duration-700">
            Hi there! 👋
          </h1>
          <p
            className="text-base font-medium text-white/60 animate-in fade-in slide-in-from-top-4 duration-700"
            style={{ animationDelay: "100ms" }}
          >
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>

      {/* Error Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6 p-8 relative z-10">
        {/* Glass Error Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-red-500/30 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-700 max-w-md">
          <div className="flex flex-col items-center gap-y-6 text-center">
            {/* Animated Error Icon */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500/20 blur-2xl animate-pulse"></div>
              <div className="relative z-10 bg-red-500/10 border-2 border-red-500/30 rounded-full p-4">
                <AlertTriangle
                  className="h-12 w-12 text-red-400 animate-pulse"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Error Message */}
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-white">
                Oops! Something went wrong
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                {errorMessage || "Invalid Configuration"}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="flex gap-2 mt-2">
              <div className="h-1 w-1 rounded-full bg-red-400/40"></div>
              <div className="h-1 w-1 rounded-full bg-red-400/60"></div>
              <div className="h-1 w-1 rounded-full bg-red-400/40"></div>
            </div>
          </div>
        </div>

        {/* Additional Help Text */}
        <div
          className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-white/40 text-xs">
            Please check your configuration and try again
          </p>
        </div>
      </div>
    </div>
  );
};
