import { useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";
import { useVapi } from "../../hooks/use-vapi";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { ArrowLeft, Mic, MicOff, Loader2, Volume2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import {
  AIConversation,
  AIConversationContent,
  AIConversationScrollButton,
} from "@workspace/ui/components/ai/conversation";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ai/message";
import { useEffect, useState, useRef } from "react";

export const WidgetVoiceScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const {
    endCall,
    isConnected,
    isConnecting,
    isSpeaking,
    startCall,
    transcript,
  } = useVapi();

  // Call duration timer
  useEffect(() => {
    if (isConnected) {
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setCallDuration(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getConnectionStatus = () => {
    if (isConnecting) return { text: "Connecting...", color: "bg-yellow-500" };
    if (isConnected) return { text: "Connected", color: "bg-green-500" };
    return { text: "Ready to call", color: "bg-gray-400" };
  };

  const status = getConnectionStatus();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <WidgetHeader>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <div className="flex items-center gap-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setScreen("selection")}
              className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <p className="font-semibold">Voice Chat</p>
              <div className="flex items-center gap-2">
                <div className={cn("size-2 rounded-full", status.color)} />
                <span className="text-xs text-muted-foreground">
                  {status.text}
                </span>
              </div>
            </div>
          </div>
          {isConnected && (
            <div className="text-sm font-medium text-muted-foreground tabular-nums">
              {formatDuration(callDuration)}
            </div>
          )}
        </div>
      </WidgetHeader>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {transcript.length > 0 ? (
          <AIConversation className="h-full flex-1">
            <AIConversationContent className="p-4">
              {transcript.map((message, index) => {
                const isUser = message.role === "user";
                return (
                  <AIMessage
                    from={message.role}
                    key={`${message.role}-${index}-${message.text}`}
                    className={
                      isUser ? "ml-auto max-w-[85%]" : "mr-auto max-w-[85%]"
                    }
                  >
                    <AIMessageContent
                      className={cn(
                        "rounded-2xl px-4 py-3 transition-all",
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </AIMessageContent>
                  </AIMessage>
                );
              })}
            </AIConversationContent>
            <AIConversationScrollButton />
          </AIConversation>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
            {/* Voice Visualizer */}
            <div className="relative">
              {/* Pulse rings */}
              {(isConnected || isConnecting) && (
                <>
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full animate-ping",
                      isSpeaking ? "bg-primary/20" : "bg-primary/10"
                    )}
                    style={{ animationDuration: "2s" }}
                  />
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full transition-all duration-300",
                      isSpeaking
                        ? "bg-primary/30 scale-125"
                        : "bg-primary/20 scale-110"
                    )}
                  />
                </>
              )}

              {/* Main circle */}
              <div
                className={cn(
                  "relative flex items-center justify-center rounded-full border-4 transition-all duration-300",
                  isConnected
                    ? isSpeaking
                      ? "border-primary bg-primary size-24 shadow-lg"
                      : "border-primary/50 bg-primary/90 size-20 shadow-md"
                    : "border-muted bg-card size-20"
                )}
              >
                {isConnecting ? (
                  <Loader2 className="size-7 text-muted-foreground animate-spin" />
                ) : isConnected ? (
                  <Volume2
                    className={cn(
                      "transition-all duration-300",
                      isSpeaking
                        ? "size-10 text-primary-foreground"
                        : "size-7 text-primary-foreground"
                    )}
                  />
                ) : (
                  <Mic className="size-7 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              <p className="font-medium text-foreground">
                {isConnecting
                  ? "Connecting..."
                  : isConnected
                    ? "Start speaking"
                    : "Start a voice call"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {isConnected
                  ? "Your conversation will appear above"
                  : "Tap the button below to begin"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      {isConnected && (
        <div className="border-t bg-card px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <div
              className={cn(
                "size-2 rounded-full transition-all",
                isSpeaking ? "animate-pulse bg-primary" : "bg-green-500"
              )}
            />
            <span className="text-sm text-muted-foreground">
              {isSpeaking ? "Assistant is speaking..." : "Listening..."}
            </span>
          </div>
        </div>
      )}

      {/* Call Controls */}
      <div className="border-t bg-card p-4">
        <div className="flex flex-col items-center gap-3">
          {isConnected ? (
            <Button
              variant="destructive"
              className="w-full h-12 rounded-lg font-medium transition-all hover:shadow-md"
              onClick={() => endCall()}
            >
              <MicOff className="h-5 w-5 mr-2" />
              End Call
            </Button>
          ) : (
            <Button
              className="w-full h-12 rounded-lg font-medium transition-all hover:shadow-md"
              disabled={isConnecting}
              onClick={() => startCall()}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5 mr-2" />
                  Start Call
                </>
              )}
            </Button>
          )}

          {/* Helper Text */}
          <p className="text-xs text-muted-foreground text-center">
            {isConnected
              ? "Voice chat is active"
              : "Start a conversation with our AI assistant"}
          </p>
        </div>
      </div>
    </div>
  );
};
