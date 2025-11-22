"use client";

import { api } from "@workspace/backend/_generated/api";
import { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
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
import { Form, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";
import { useState } from "react";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
    mode: "onChange", // Yeh important hai - real-time validation ke liye
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

      // Form reset karo successful submission ke baad
      form.reset();
    } catch (err) {
      console.error("Failed to send message:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send message. Please try again."
      );
    } finally {
      // Always loading state reset karo
      setIsSubmitting(false);
    }
  };

  const isConversationResolved = conversation?.status === "resolved";
  const isLoading = messages.status === "LoadingFirstPage";

  // Submit button enable karo agar message hai aur submitting nahi ho raha
  const messageValue = form.watch("message");
  const canSubmit =
    !isConversationResolved && !isSubmitting && messageValue.trim().length > 0;

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b bg-background p-2.5">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">
            {conversation?.status === "resolved" ? "Resolved" : "Active"}{" "}
            Conversation
          </h2>
        </div>
        <Button size="sm" variant="ghost">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </header>

      <AIConversation className="flex-1 overflow-hidden">
        <AIConversationContent>
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
        <Form {...form}>
          <AIInput onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="message"
              disabled={isConversationResolved || isSubmitting}
              render={({ field }) => (
                <AIInputTextarea
                  disabled={isConversationResolved || isSubmitting}
                  onChange={field.onChange}
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
                  value={field.value}
                />
              )}
            />
            <AIInputToolbar>
              <AIInputTools>
                <AIInputButton
                  disabled={isConversationResolved || isSubmitting}
                >
                  <Wand2Icon className="h-4 w-4" />
                  Enhance
                </AIInputButton>
              </AIInputTools>
              <AIInputSubmit
                disabled={!canSubmit}
                type="submit"
                status= "ready"
              />
            </AIInputToolbar>
          </AIInput>
        </Form>
      </div>
    </div>
  );
};
