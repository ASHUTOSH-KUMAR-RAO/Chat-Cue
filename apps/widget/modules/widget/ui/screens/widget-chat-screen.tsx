"use client";

import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";

import { Form, FormField } from "@workspace/ui/components/form";

import {
  AIInput,
  AIInputSubmit,
  AIInputTextarea,
  AIInputTools,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

import { AIResponse } from "@workspace/ui/components/ai/response";

import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  message: z.string().min(1, "Message is Required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId
      ? {
          conversationId,
          contactSessionId,
        }
      : "skip"
  );

  const messages = useThreadMessages(
    api.public.messages.getMany as any,
    conversation !== undefined && conversation?.threadId && contactSessionId
      ? {
          threadId: conversation.threadId,
          contactSessionId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId) {
      return;
    }

    form.reset();

    await createMessage({
      threadId: conversation.threadId,
      prompt: values.message,
      contactSessionId,
    });
  };

  if (conversation === undefined) {
    return (
      <>
        <WidgetHeader className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <Button onClick={onBack} size="icon" variant="ghost">
              <ArrowLeftIcon />
            </Button>
            <p>Chat</p>
          </div>
        </WidgetHeader>
        <div className="flex flex-1 items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <WidgetHeader className="flex items-center justify-between">
        <div className="flex items-center gap-x-1">
          <Button onClick={onBack} size="icon" variant="ghost">
            <ArrowLeftIcon />
          </Button>
          <p>Chat</p>
        </div>
        <Button size="icon" variant="ghost">
          <MenuIcon />
        </Button>
      </WidgetHeader>
      <AIConversation>
        <AIConversationContent>
          {toUIMessages(messages.results || []).map((message) => {
            return (
              <AIMessage
                from={message.role === "user" ? "user" : "assistant"}
                key={message.id}
              >
                <AIMessageContent>
                  <AIResponse>{(message as any).content}</AIResponse>
                </AIMessageContent>
              </AIMessage>
            );
          })}
        </AIConversationContent>
      </AIConversation>
      <Form {...(form as any)}>
        <AIInput
          className="rounded-none border-x-0 border-b-0"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control as any}
            name="message"
            disabled={conversation.status === "resolved"}
            render={({ field }) => (
                <AIInputTextarea
                  disabled={conversation.status === "resolved"}
                  onChange={field.onChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) e.preventDefault();
                    form.handleSubmit(onSubmit)();
                  }}
                  placeholder={
                    conversation?.status === "resolved"?"This Conversation has been resolved":"Type Your Messages"
                  }
                  value={field.value}
                />
            )}
          />
          <AIInputToolbar>
            <AIInputTools/>
            <AIInputSubmit
            disabled={conversation?.status === "resolved" || !form.formState.isValid}
            status="ready"
            type="submit"
            />
          </AIInputToolbar>
        </AIInput>
      </Form>
    </>
  );
};
