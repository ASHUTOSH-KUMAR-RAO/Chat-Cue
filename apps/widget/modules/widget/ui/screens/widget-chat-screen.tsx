"use client";

import { useThreadMessages, toUIMessages } from "@convex-dev/agent/react";
import { ArrowLeft, Menu, Send } from "lucide-react";
import { useInfinitScroll } from "@workspace/ui/hooks/use-infinite.scroll";
import {
  InfiniteScrollTrigger,
} from "@workspace/ui/components/infinite-scroll-trigger";
import {DicebearAvatar} from "@workspace/ui/components/dicebear-avatar"
import { Button } from "@workspace/ui/components/button";
import { useAtomValue, useSetAtom } from "jotai";
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
} from "@workspace/ui/components/ai/conversation";

import { Form, FormField } from "@workspace/ui/components/form";

import {
  AIInput,
  AIInputTextarea,
  AIInputTools,
  AIInputToolbar,
} from "@workspace/ui/components/ai/input";

import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";

import { AIResponse } from "@workspace/ui/components/ai/response";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";

const formSchema = z.object({
  message: z.string().min(1, "Message is Required"),
});

// Black & White Particle Component
const Particle = ({ delay }: { delay: number }) => {
  const [position, setPosition] = useState({
    x: Math.random() * 100,
    y: Math.random() * 100,
  });
  const isWhite = Math.random() > 0.5;
  const size = Math.random() * 4 + 2;

  useEffect(() => {
    const interval = setInterval(
      () => {
        setPosition({
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      },
      8000 + Math.random() * 4000
    );

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`absolute rounded-full ${isWhite ? "bg-white" : "bg-black"} opacity-20 blur-[1px]`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}%`,
        top: `${position.y}%`,
        transition: `all ${8 + Math.random() * 4}s ease-in-out`,
        animationDelay: `${delay}ms`,
      }}
    />
  );
};

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const conversationId = useAtomValue(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="flex h-full flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Black & White Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <Particle key={i} delay={i * 150} />
          ))}
        </div>

        {/* Header */}
        <div className="relative backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-x-3">
              <Button
                onClick={onBack}
                size="icon"
                variant="ghost"
                className="hover:bg-white/10 transition-all duration-300 hover:scale-110 text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="space-y-1">
                <p className="font-semibold text-white">Chat</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                  <span className="text-xs text-white/50">Loading...</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        <div className="flex flex-1 items-center justify-center p-8 relative z-10">
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl">
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"></div>
            </div>
            <p className="text-white/90 font-medium">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Black & White Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 40 }).map((_, i) => (
          <Particle key={i} delay={i * 150} />
        ))}
      </div>

      {/* Header - Glass Effect */}
      <div className="relative backdrop-blur-xl bg-black/60 border-b border-white/10 shadow-2xl z-20">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-x-3">
            <Button
              onClick={onBack}
              size="icon"
              variant="ghost"
              className="hover:bg-white/10 transition-all duration-300 hover:scale-110 active:scale-95 text-white/70 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="space-y-0.5">
              <p className="font-semibold text-white">Chat</p>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                <span className="text-xs text-white/50">Active</span>
              </div>
            </div>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="hover:bg-white/10 transition-all duration-300 hover:rotate-90 text-white/70 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative z-10">
        <AIConversation className="h-full">
          <AIConversationContent className="p-4 space-y-3">
            <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}
            />
            {toUIMessages(messages.results || []).map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={message.id}
                  className="animate-in fade-in slide-in-from-bottom-3 duration-500"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <AIMessage
                    from={isUser ? "user" : "assistant"}
                    className={`
                      group transition-all duration-300 hover:scale-[1.01]
                      ${isUser ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"}
                    `}
                  >
                    <AIMessageContent
                      className={`
                        rounded-2xl px-4 py-3 shadow-xl transition-all duration-300 group-hover:shadow-2xl
                        ${
                          isUser
                            ? "bg-gradient-to-br from-gray-200 to-gray-300 text-black shadow-gray-400/30 border border-gray-300/20"
                            : "backdrop-blur-xl bg-black/40 border border-white/10 text-white shadow-black/40"
                        }
                      `}
                    >
                      <AIResponse className="text-inherit text-[15px] leading-relaxed">
                        {(message as any).content}
                      </AIResponse>
                    </AIMessageContent>
                    {message.role === "assistant" && (
                      <DicebearAvatar
                        imageUrl="/avatar.svg"
                        seed="assistant"
                        size={32}
                      />
                    )}
                  </AIMessage>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isSubmitting && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 mr-auto max-w-[80%]">
                <div className="backdrop-blur-xl bg-black/40 border border-white/10 rounded-2xl px-4 py-3 shadow-xl">
                  <div className="flex gap-1.5">
                    <div
                      className="h-2 w-2 rounded-full bg-white/70 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-white/70 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-white/70 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </AIConversationContent>
        </AIConversation>
      </div>

      {/* Input Area - Glass Effect */}
      <div className="relative backdrop-blur-xl bg-black/60 border-t border-white/10 shadow-2xl z-20">
        <Form {...(form as any)}>
          <div
            className="p-4"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit(onSubmit)();
            }}
          >
            <div className="relative backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 shadow-xl hover:border-white/20 focus-within:border-white/30 transition-all duration-300">
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
                    className="border-0 bg-transparent focus-visible:ring-0 resize-none min-h-[56px] text-white placeholder:text-white/30 px-4 pt-4"
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
                  className="h-10 w-10 rounded-xl bg-gradient-to-br from-gray-300 to-gray-400 text-black hover:from-gray-400 hover:to-gray-500 shadow-lg shadow-gray-500/30 hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send
                    className={`h-4 w-4 ${isSubmitting ? "animate-pulse" : ""}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
