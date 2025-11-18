"use client";

import { ChevronRight, MessageSquareText } from "lucide-react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState, useEffect } from "react";

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

export const WidgetSellectionScreen = () => {
  const [isPending, setIsPending] = useState(false);
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || " ")
  );

  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization Id");
      return;
    }
    setIsPending(true);
    try {
      const conversationId = await createConversation({
        contactSessionId,
        organizationId,
      });
      setConversationId(conversationId);
      setScreen("chat");
    } catch (error) {
      setScreen("auth");
    } finally {
      setIsPending(false);
    }
  };

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

      {/* Selection Content */}
      <div className="flex flex-1 flex-col gap-y-6 p-6 overflow-y-auto relative z-10 justify-center">
        {/* Glass Card Container */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-700">
          <div className="space-y-4">
            {/* Title */}
            <div className="text-center space-y-2 mb-6">
              <h2 className="text-lg font-semibold text-white">
                Choose an option
              </h2>
              <p className="text-white/60 text-sm">
                How would you like to get started?
              </p>
            </div>

            {/* Start Chat Button */}
            <Button
              className="h-16 w-full justify-between backdrop-blur-xl bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group"
              variant="outline"
              onClick={handleNewConversation}
              disabled={isPending}
            >
              <div className="flex items-center gap-x-3">
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <span className="font-medium">
                  {isPending ? "Starting Chat..." : "Start Chat"}
                </span>
              </div>
              {isPending ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Help Text */}
        <div
          className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <p className="text-white/40 text-xs">
            We&apos;re here to help you 24/7
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-1 rounded-full bg-white/30"></div>
            <div className="h-1 w-1 rounded-full bg-white/50"></div>
            <div className="h-1 w-1 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
