"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { Loader2 } from "lucide-react";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";

type InitStep = "org" | "session" | "settings" | "done";

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

  const setWidgetSettings = useSetAtom(widgetSettingsAtom);
  const [step, setStep] = useState<InitStep>("org");
  const [sessionValid, setSessionValid] = useState(false);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || " ")
  );

  // Step 1: Validating The Organization
  const validateOrganization = useAction(api.public.organization.validate);
  useEffect(() => {
    if (step !== "org") {
      return;
    }
    setLoadingMessage("Finding the organization ID...");
    if (!organizationId) {
      setErrorMessage("Organization ID is required");
      setScreen("error");
      return;
    }
    setLoadingMessage("Verifying organization...");
    validateOrganization({ organizationId })
      .then((result) => {
        if (result.valid) {
          setOrganizationId(organizationId);
          setStep("session");
        } else {
          setErrorMessage(result.reason || "Invalid configuration");
          setScreen("error");
        }
      })
      .catch(() => {
        setErrorMessage("Unable to verify organization");
        setScreen("error");
      });
  }, [
    step,
    organizationId,
    setErrorMessage,
    setScreen,
    setOrganizationId,
    setStep,
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
      setSessionValid(false);
      setStep("settings");
      return;
    }

    setLoadingMessage("Validating session...");

    validateContactSession({
      contactSessionId: contactSessionId as Id<"contactSessions">,
    })
      .then((result) => {
        setSessionValid(result.valid);
        setStep("settings");
      })
      .catch(() => {
        setSessionValid(false);
        setStep("settings");
      });
  }, [step, contactSessionId, validateContactSession, setLoadingMessage]);

  // Step 3: Load Widget Settings
  const widgetSettings = useQuery(
    api.public.widgetSettings.getByConversationId,
    organizationId ? { organizationId } : "skip"
  );

  useEffect(() => {
    if (step !== "settings") {
      return;
    }
    setLoadingMessage("Loading widget settings...");

    if (widgetSettings !== undefined) {
      setWidgetSettings(widgetSettings);
      setStep("done");
    }
  }, [step, widgetSettings, setLoadingMessage, setWidgetSettings, setStep]);

  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="flex flex-col gap-2 px-4 py-6">
          <h1 className="text-xl font-semibold">Hi there! 👋</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started
          </p>
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
        {/* Loading Card */}
        <div className="flex flex-col items-center gap-6 rounded-2xl border bg-card p-8 shadow-lg">
          {/* Loader */}
          <div className="relative">
            <Loader2 className="size-12 animate-spin text-primary" />
          </div>

          {/* Loading Message */}
          <div className="text-center space-y-2">
            <p className="font-medium text-foreground">
              {loadingMessage || "Loading..."}
            </p>
            <div className="flex justify-center gap-1.5">
              <div className="size-1.5 rounded-full bg-primary animate-bounce" />
              <div
                className="size-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="size-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        </div>

        {/* Progress Steps Indicator */}
        <div className="flex gap-2">
          <div
            className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
              step === "org" ? "bg-primary" : "bg-muted"
            }`}
          />
          <div
            className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
              step === "session" ? "bg-primary" : "bg-muted"
            }`}
          />
          <div
            className={`h-1.5 w-8 rounded-full transition-colors duration-300 ${
              step === "settings" || step === "done" ? "bg-primary" : "bg-muted"
            }`}
          />
        </div>
      </div>
    </div>
  );
};
