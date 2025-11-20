"use client";

import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
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
import { useState } from "react";
import WidgetFooter from "../components/widget-footer";

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
      <div className="flex flex-1 flex-col gap-y-4 p-4 overflow-y-auto">
        <Button
          className="group h-16 w-full justify-between transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          variant="outline"
          onClick={handleNewConversation}
          disabled={isPending}
        >
          <div className="flex items-center gap-x-2">
            <MessageSquareTextIcon className="size-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="transition-all duration-300 group-hover:translate-x-1">
              Start Chat
            </span>
          </div>
          <ChevronRightIcon className="transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </div>
      <WidgetFooter />
    </>
  );
};
