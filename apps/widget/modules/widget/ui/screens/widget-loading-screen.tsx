"use client";

import { useAtomValue, useSetAtom } from "jotai";

import { LoaderIcon } from "lucide-react";
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

  // todo => Step 1 :- Validating The Organization
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

  // step 2 :- validating session (if it exists)

  const validateContactSession = useMutation(
    api.public.contactSessions.validate
  ); // ? aur rahi baat hum yeha per useMutation isiliey use kr rehe hai ki hum session ke liye koi  third party sdk use nhi kaar rehe hai convex Db hi use kr rehe hai isiliye hamne yeha per mutation ke sath useMutation use krte hai nhi to yedi hum third party sdk session mein bhi use krte to yeha per useMutation ke place per useAction hi use krte jaisa ki pta hai last organization humne use kiya hai
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
    <>
      <WidgetHeader>
        <div className="flex flex-col justify-between gap-y-2.5 px-4 py-6 bg-gradient-to-r from-background/50 to-transparent">
          <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text rounded-lg">
            Hi there ! 👋
          </h1>
          <p className="text-base font-medium text-muted-foreground/90">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <LoaderIcon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading..."}</p>
      </div>
    </>
  );
};
