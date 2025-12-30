"use client";
import {
  AISuggestion,
  AISuggestions,
} from "@workspace/ui/components/ai/suggestion";
import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { ArrowLeft, Menu, Send, Loader2 } from "lucide-react";
import { useInfinitScroll } from "@workspace/ui/hooks/use-infinite.scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
  widgetSettingsAtom,
} from "../../atoms/widget-atoms";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

import {
  AIConversation,
  AIConversationContent,
} from "@workspace/ui/components/ai/conversation";

import { Form, FormField } from "@workspace/ui/components/form";

import { AIInputTextarea } from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

import { AIResponse } from "@workspace/ui/components/ai/response";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useMemo } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Message is Required"),
});

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const widgetSettings = useAtomValue(widgetSettingsAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onBack = () => {
    setConversationId(null);
    setScreen("selection");
  };

  const suggestions = useMemo(() => {
    if (!widgetSettings) {
      return [];
    }
    return Object.keys(widgetSettings.defaultSuggestions).map((key) => {
      return widgetSettings.defaultSuggestions[
        key as keyof typeof widgetSettings.defaultSuggestions
      ];
    });
  }, [widgetSettings]);

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

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfinitScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const createMessage = useAction(api.public.messages.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!conversation || !contactSessionId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    form.reset();

    try {
      await createMessage({
        threadId: conversation.threadId,
        prompt: values.message,
        contactSessionId,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (conversation === undefined) {
    return (
      <div className="flex h-full flex-col bg-background">
        {/* Header */}
        <div className="border-b bg-card">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={onBack}
                size="icon"
                variant="ghost"
                className="size-9"
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div>
                <p className="font-semibold">Chat</p>
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs text-muted-foreground">
                    Loading...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Loading conversation...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              size="icon"
              variant="ghost"
              className="size-9"
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <p className="font-semibold">Chat</p>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Active</span>
              </div>
            </div>
          </div>
          <Button size="icon" variant="ghost" className="size-9">
            <Menu className="size-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <AIConversation className="h-full">
          <AIConversationContent className="p-4 space-y-3">
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
            {toUIMessages(messages.results || []).map((message) => {
              const isUser = message.role === "user";
              return (
                <AIMessage
                  key={message.id}
                  from={isUser ? "user" : "assistant"}
                  className={
                    isUser ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"
                  }
                >
                  <AIMessageContent
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <AIResponse className="text-sm leading-relaxed">
                      {(message as any).content}
                    </AIResponse>
                  </AIMessageContent>
                  {!isUser && (
                    <DicebearAvatar
                      imageUrl="/avatar.svg"
                      seed="assistant"
                      size={32}
                    />
                  )}
                </AIMessage>
              );
            })}

            {/* Typing Indicator */}
            {isSubmitting && (
              <div className="mr-auto max-w-[85%]">
                <div className="bg-muted rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <div className="size-2 rounded-full bg-foreground/40 animate-bounce" />
                    <div
                      className="size-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="size-2 rounded-full bg-foreground/40 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </AIConversationContent>
        </AIConversation>
      </div>

      {/* Suggestions */}
      <AISuggestions className="flex w-full items-end p-2">
        {suggestions.map((suggestion) => {
          if (!suggestion) return null;
          return (
            <AISuggestion
              key={suggestion}
              onClick={() => {
                form.setValue("message", suggestion, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
                form.handleSubmit(onSubmit)();
              }}
              suggestion={suggestion}
            />
          );
        })}
      </AISuggestions>

      {/* Input Area */}
      <div className="border-t bg-card shadow-sm">
        <Form {...(form as any)}>
          <div
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
          >
            <div className="relative rounded-xl border bg-background">
              <FormField
                control={form.control as any}
                name="message"
                disabled={conversation.status === "resolved" || isSubmitting}
                render={({ field }) => (
                  <AIInputTextarea
                    disabled={
                      conversation.status === "resolved" || isSubmitting
                    }
                    onChange={field.onChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    placeholder={
                      conversation?.status === "resolved"
                        ? "This conversation has been resolved"
                        : "Type your message..."
                    }
                    value={field.value}
                    className="border-0 bg-transparent focus-visible:ring-0 resize-none min-h-[56px] px-4 pt-4"
                  />
                )}
              />
              <div className="px-3 pb-3 flex items-center justify-end">
                <Button
                  disabled={
                    conversation?.status === "resolved" ||
                    !form.formState.isValid ||
                    isSubmitting
                  }
                  onClick={form.handleSubmit(onSubmit)}
                  type="button"
                  size="icon"
                  className="size-10 rounded-lg shadow-sm"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
