"use client";

import { useInfinitScroll } from "@workspace/ui/hooks/use-infinite.scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";
import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useAction, useMutation, useQuery } from "convex/react";
import {
  MoreHorizontalIcon,
  Wand2Icon,
  Loader2Icon,
  AlertCircleIcon,
  MessageSquareIcon,
} from "lucide-react";

import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";

import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "@workspace/ui/components/ai/input";

import { FormField } from "@workspace/ui/components/form";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

import { AIResponse } from "@workspace/ui/components/ai/response";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useState } from "react";
import { ConversationStatusButton } from "../components/conversation-status-button";
import { cn } from "@workspace/ui/lib/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";

const formSchema = z.object({
  message: z.string().min(1, "Message is Required"),
});

type FormValues = z.infer<typeof formSchema>;

export const ConversationIdView = ({
  conversationId,
}: {
  conversationId: Id<"conversations">;
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const conversation = useQuery(api.private.conversations.getOne, {
    conversationId,
  });

  const messages = useThreadMessages(
    api.private.messages.getMany as any,
    conversation?.threadId
      ? {
          threadId: conversation.threadId,
        }
      : "skip",
    { initialNumItems: 10 }
  );

  const enhanceResponse = useAction(api.private.messages.enhanceResponse);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange",
  });

  const [isEnhancing, setIsEnhancing] = useState(false);
  const handleEnhanceResponse = async () => {
    setIsEnhancing(true);
    const currentValue = form.getValues("message");
    try {
      const response = await enhanceResponse({ prompt: currentValue });
      form.setValue("message", response);
    } catch (error) {
      console.error("Failed to enhance response:", error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const { canLoadMore, handleLoadMore, isLoadingMore, topElementRef } =
    useInfinitScroll({
      status: messages.status,
      loadMore: messages.loadMore,
      loadSize: 10,
    });

  const createMessage = useMutation(api.private.messages.create);

  const onSubmit = async (values: FormValues) => {
    const trimmedMessage = values.message.trim();

    if (!trimmedMessage) {
      setError("Please enter a message");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await createMessage({
        conversationId,
        prompt: trimmedMessage,
      });

      form.reset();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isConversationResolved = conversation?.status === "resolved";
  const isLoading = messages.status === "LoadingFirstPage";

  const messageValue = form.watch("message");
  const canSubmit =
    !isConversationResolved && !isSubmitting && messageValue.trim().length > 0;

  const updateConversationStatus = useMutation(
    api.private.conversations.updateStatus
  );
  const handleToggleStatus = async () => {
    if (!conversation) return;
    let newStatus: "unresolved" | "resolved" | "escalated";
    if (conversation.status === "unresolved") {
      newStatus = "escalated";
    } else if (conversation.status === "escalated") {
      newStatus = "resolved";
    } else {
      newStatus = "unresolved";
    }
    try {
      await updateConversationStatus({
        conversationId,
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update conversation status:", err);
    }
  };

  if (conversation === undefined || messages.status === "LoadingFirstPage") {
    return <ConversationIdViewLoading />;
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-3 shadow-sm">
        <Button size="sm" variant="ghost" className="size-9 p-0">
          <MoreHorizontalIcon className="size-4" />
        </Button>
        {conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation?.status}
          />
        )}
      </header>

      {/* Messages Area */}
      <AIConversation className="flex-1 overflow-hidden">
        <AIConversationContent className="px-2">
          <InfiniteScrollTrigger
            ref={topElementRef}
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-3">
                <Loader2Icon className="size-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : messages.results && messages.results.length > 0 ? (
            toUIMessages(messages.results)?.map((message) => {
              const isUser = message.role === "user";
              return (
                <AIMessage
                  from={message.role === "user" ? "assistant" : "user"}
                  key={message.id}
                  className="py-3"
                >
                  {!isUser && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 ring-2 ring-primary/20">
                      <DicebearAvatar seed="assistant" size={24} />
                    </div>
                  )}
                  <AIMessageContent className="rounded-2xl shadow-sm">
                    <AIResponse>{(message as any).content}</AIResponse>
                  </AIMessageContent>
                  {isUser && (
                    <div className="flex size-8 items-center justify-center rounded-full bg-muted ring-2 ring-border">
                      <DicebearAvatar
                        seed={conversation?.contactSessionId}
                        size={24}
                      />
                    </div>
                  )}
                </AIMessage>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted mb-4">
                <MessageSquareIcon className="size-8 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">No messages yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start the conversation below
              </p>
            </div>
          )}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive shadow-sm">
          <AlertCircleIcon className="size-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="px-3 pb-3">
        <AIInput onSubmit={form.handleSubmit(onSubmit)} className="shadow-lg">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={isConversationResolved || isSubmitting || isEnhancing}
                onChange={field.onChange}
                value={field.value}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (canSubmit) {
                      form.handleSubmit(onSubmit)();
                    }
                  }
                }}
                placeholder={
                  isConversationResolved
                    ? "This conversation has been resolved"
                    : isSubmitting
                      ? "Sending..."
                      : "Type your message..."
                }
                className="min-h-[80px] resize-none"
              />
            )}
          />
          <AIInputToolbar className="border-t bg-muted/30 px-3 py-2">
            <AIInputTools>
              <AIInputButton
                onClick={handleEnhanceResponse}
                disabled={
                  isConversationResolved ||
                  isSubmitting ||
                  isEnhancing ||
                  !form.formState.isValid
                }
                className="gap-2"
              >
                {isEnhancing ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Wand2Icon className="size-4" />
                    Enhance
                  </>
                )}
              </AIInputButton>
            </AIInputTools>
            <AIInputSubmit
              disabled={!canSubmit || isEnhancing}
              type="submit"
              status="ready"
              className="shadow-sm"
            />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="flex h-full flex-col bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 py-3 shadow-sm">
        <Button disabled size="sm" variant="ghost" className="size-9 p-0">
          <MoreHorizontalIcon className="size-4" />
        </Button>
        <Skeleton className="h-8 w-24 rounded-full" />
      </header>

      {/* Messages Skeleton */}
      <AIConversation className="flex-1 overflow-hidden">
        <AIConversationContent className="px-2">
          {Array.from({ length: 6 }).map((_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-56", "w-64", "w-52", "w-60"];
            const width = widths[index % widths.length];

            return (
              <div
                key={index}
                className={cn(
                  "flex w-full items-end gap-3 py-3",
                  isUser ? "flex-row-reverse" : ""
                )}
              >
                <Skeleton className="size-8 flex-shrink-0 rounded-full" />
                <Skeleton className={`h-16 ${width} rounded-2xl`} />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>

      {/* Input Skeleton */}
      <div className="px-3 pb-3">
        <div className="rounded-2xl border bg-background shadow-lg">
          <Skeleton className="h-20 w-full rounded-t-2xl" />
          <div className="flex items-center justify-between border-t bg-muted/30 px-3 py-2">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="size-9 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};
