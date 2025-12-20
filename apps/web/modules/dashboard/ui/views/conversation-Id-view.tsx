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
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
        {conversation && (
          <ConversationStatusButton
            onClick={handleToggleStatus}
            status={conversation?.status}
          />
        )}
      </header>

      <AIConversation className="flex-1 overflow-hidden">
        <AIConversationContent>
          <InfiniteScrollTrigger
            ref={topElementRef}
            canLoadMore={canLoadMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={handleLoadMore}
          />
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2Icon className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : messages.results && messages.results.length > 0 ? (
            toUIMessages(messages.results)?.map((message) => {
              const isUser = message.role === "user";
              return (
                <AIMessage
                  from={message.role === "user" ? "assistant" : "user"}
                  key={message.id}
                >
                  {!isUser && <DicebearAvatar seed="assistant" size={32} />}
                  <AIMessageContent>
                    <AIResponse>{(message as any).content}</AIResponse>
                  </AIMessageContent>
                  {isUser && (
                    <DicebearAvatar
                      seed={conversation?.contactSessionId}
                      size={32}
                    />
                  )}
                </AIMessage>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation below</p>
            </div>
          )}
        </AIConversationContent>
        <AIConversationScrollButton />
      </AIConversation>

      {error && (
        <div className="mx-2 mb-2 flex items-center gap-2 rounded-md bg-destructive/10 p-2 text-sm text-destructive">
          <AlertCircleIcon className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="pl-2">
        <AIInput onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <AIInputTextarea
                disabled={
                  isConversationResolved || isSubmitting || isEnhancing
                }
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
              />
            )}
          />
          <AIInputToolbar>
            <AIInputTools>
              <AIInputButton
                onClick={handleEnhanceResponse}
                disabled={
                  isConversationResolved ||
                  isSubmitting ||
                  isEnhancing ||
                  !form.formState.isValid
                }
              >
                <Wand2Icon className="h-4 w-4" />
                {isEnhancing ? "Enhancing..." : "Enhance"}
              </AIInputButton>
            </AIInputTools>
            <AIInputSubmit
              disabled={!canSubmit || isEnhancing}
              type="submit"
              status="ready"
            />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};

export const ConversationIdViewLoading = () => {
  return (
    <div className="h-full flex-col bg-muted">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <Button disabled variant="ghost">
          <MoreHorizontalIcon />
        </Button>
      </header>

      <AIConversation className="max-h-[calc(100vh-180px)]">
        <AIConversationContent>
          {Array.from({ length: 8 }).map((_, index) => {
            const isUser = index % 2 === 0;
            const widths = ["w-48", "w-60", "w-52", "w-56"];
            const width = widths[index % widths.length];

            return (
              <div
                key={index}
                className={cn(
                  "group flex w-full items-end justify-end gap-2 py-2[&>div]:max-w-[80%]",
                  isUser ? "is-user" : "is-assistant flex-row-reverse"
                )}
              >
                <Skeleton
                  className={`h-9 ${width} rounded-lg bg-neutral-200`}
                />
                <Skeleton className={`size-8 rounded-full bg-neutral-200`} />
              </div>
            );
          })}
        </AIConversationContent>
      </AIConversation>

      <div className="p-2">
        <AIInput>
          <AIInputTextarea
            disabled
            placeholder="Type your response as an operator"
          />
          <AIInputToolbar>
            <AIInputTools />
            <AIInputSubmit disabled status="ready" />
          </AIInputToolbar>
        </AIInput>
      </div>
    </div>
  );
};
