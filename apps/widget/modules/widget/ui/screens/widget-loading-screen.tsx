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
  vapiSecretsAtom,
} from "@/modules/widget/atoms/widget-atoms";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

const STEPS: InitStep[] = ["org", "session", "settings", "vapi"];

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
  const setVapiSecrets = useSetAtom(vapiSecretsAtom);
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
      setStep("vapi");
    }
  }, [step, widgetSettings, setLoadingMessage, setWidgetSettings, setStep]);

  // Step 4: Load Vapi Secrets
  const getVapiSecrets = useAction(api.public.secrets.getVapiSecrets);

  useEffect(() => {
    if (step !== "vapi") {
      return;
    }

    if (!organizationId) {
      setStep("done");
      return;
    }

    setLoadingMessage("Loading voice features...");

    getVapiSecrets({ organizationId })
      .then((secrets) => {
        setVapiSecrets(secrets);
        setStep("done");
      })
      .catch(() => {
        setVapiSecrets(null);
        setStep("done");
      });
  }, [
    step,
    organizationId,
    getVapiSecrets,
    setVapiSecrets,
    setLoadingMessage,
    setStep,
  ]);

  // Step 5: Navigate to appropriate screen
  useEffect(() => {
    if (step !== "done") {
      return;
    }

    const hasValidSession = contactSessionId && sessionValid;
    setScreen(hasValidSession ? "selection" : "auth");
  }, [step, contactSessionId, sessionValid, setScreen]);

  const currentStepIndex = STEPS.indexOf(step);

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="flex flex-col gap-1.5 px-4 py-5">
          <h1 className="text-xl font-semibold">Hi there! 👋</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started
          </p>
        </div>
      </div>

      {/* Loading Content */}
      <div className="flex flex-1 flex-col items-center justify-center gap-8 p-6">
        {/* Loading Card */}
        <div className="flex flex-col items-center gap-5 rounded-lg border bg-card p-8">
          {/* Loader */}
          <Loader2 className="size-10 animate-spin text-primary" />

          {/* Loading Message */}
          <p className="font-medium text-center">
            {loadingMessage || "Loading..."}
          </p>
        </div>

        {/* Progress Steps Indicator */}
        <div className="flex gap-2">
          {STEPS.map((s, index) => (
            <div
              key={s}
              className={`h-1 w-8 rounded-full transition-colors ${
                index <= currentStepIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
