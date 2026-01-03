"use client";

import {
  ChevronRightIcon,
  MessageSquareTextIcon,
  MicIcon,
  PhoneIcon,
} from "lucide-react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  errorMessageAtom,
  hasVapiSecretAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";
import WidgetFooter from "../components/widget-footer";

export const WidgetSelectionScreen = () => {
  const [isPending, setIsPending] = useState(false);
  const setScreen = useSetAtom(screenAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || " ")
  );
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const hasVapiSecrets = useAtomValue(hasVapiSecretAtom);
  const createConversation = useMutation(api.public.conversations.create);

  const handleNewConversation = async () => {
    if (!contactSessionId) {
      setScreen("auth");
      return;
    }

    if (!organizationId) {
      setScreen("error");
      setErrorMessage("Missing organization ID");
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

  // Helper function to check if value is valid (case-insensitive)
  const isValidValue = (value: string | undefined | null): boolean => {
    if (!value || value.trim() === "") return false;
    return value.toLowerCase() !== "none";
  };

  return (
    <>
      <WidgetHeader>
        <div className="flex flex-col gap-2 px-4 py-6">
          <h1 className="text-xl font-semibold">Hi there! 👋</h1>
          <p className="text-sm text-muted-foreground">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
        {/* Chat Button - Always visible */}
        <Button
          className="h-16 w-full justify-between"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <MessageSquareTextIcon className="size-4" />
            <span>Start Chat</span>
          </div>
          <ChevronRightIcon className="size-4" />
        </Button>

        {/* Voice Call Button - ✅ Check for valid assistantId */}
        {hasVapiSecrets &&
          isValidValue(widgetSettings?.vapiSettings?.assistantId) && (
            <Button
              className="h-16 w-full justify-between"
              variant="outline"
              onClick={() => setScreen("voice")}
              disabled={isPending}
            >
              <div className="flex items-center gap-2">
                <MicIcon className="size-4" />
                <span>Start Voice Call</span>
              </div>
              <ChevronRightIcon className="size-4" />
            </Button>
          )}

        {/* Phone Call Button - ✅ Check for valid phoneNumber */}
        {hasVapiSecrets &&
          isValidValue(widgetSettings?.vapiSettings?.phoneNumber) && (
            <Button
              className="h-16 w-full justify-between"
              variant="outline"
              onClick={() => setScreen("contact")}
              disabled={isPending}
            >
              <div className="flex items-center gap-2">
                <PhoneIcon className="size-4" />
                <span>Call Us</span>
              </div>
              <ChevronRightIcon className="size-4" />
            </Button>
          )}
      </div>
      <WidgetFooter />
    </>
  );
};
