"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Loader } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

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

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);

  const setScreen = useSetAtom(screenAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);

  const setOrganizationId = useSetAtom(organizationIdAtom);

  const [step, setstep] = useState<InitStep>("org");
  const [sessionValid, setsessionValid] = useState(false);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || " ")
  );

  // Step 1: Validating The Organization
  const validateOrganization = useAction(api.public.organization.validate);
  useEffect(() => {
    if (step !== "org") {
      return;
    }
    setLoadingMessage("Finding the organization Id...");
    if (!organizationId) {
      setErrorMessage("organization Id is required");
      setScreen("error");
      return;
    }
    setLoadingMessage("Verifying Organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setstep("session");
        } else {
          setErrorMessage(result.reason || "Invalid Configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to Verifying Organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setstep,
    validateOrganization,
    setLoadingMessage,
  ]);

  // Step 2: Validating session
  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  );
  useEffect(() => {
    if (step !== "session") {
      return;
    }

    setLoadingMessage("Finding contact session ID...");

    if (!contactSessionId) {
      setsessionValid(false);
      setstep("done");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        setsessionValid(result.valid);
        setstep("done");
      })
      .catch(() => {
        setsessionValid(false);
        setstep("done");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <div className="flex h-full flex-col relative overflow-hidden">
      {/* Black & White Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} delay={i * 150} />
        ))}
      </div>

      {/* Header with Glass Effect */}
      <div className="relative backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl z-10">
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
      </div>

      {/* Loading Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-y-6 p-8 relative z-10">
        {/* Glass Loading Card */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-700">
          <div className="flex flex-col items-center gap-y-6">
            {/* Animated Loader */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse"></div>
              <Loader
                className="h-12 w-12 text-white animate-spin relative z-10"
                strokeWidth={2.5}
              />
            </div>

            {/* Loading Message */}
            <div className="text-center space-y-2">
              <p className="text-white/90 font-medium text-base animate-pulse">
                {loadingMessage || "Loading..."}
              </p>
              <div className="flex justify-center gap-1.5">
                <div
                  className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></div>
                <div
                  className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></div>
                <div
                  className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps Indicator */}
        <div
          className="flex gap-2 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: "200ms" }}
        >
          <div
            className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === "org" ? "bg-white" : "bg-white/20"}`}
          ></div>
          <div
            className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === "session" ? "bg-white" : "bg-white/20"}`}
          ></div>
          <div
            className={`h-1.5 w-8 rounded-full transition-all duration-500 ${step === "done" ? "bg-white" : "bg-white/20"}`}
          ></div>
        </div>
      </div>
    </div>
  );
};
