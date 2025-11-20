"use client";

import { WidgetHeader } from "@/modules/widget/ui/components/widget-header";
import WidgetFooter from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, MessageSquare, Inbox } from "lucide-react";
import { useAtomValue, useSetAtom } from "jotai";
import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import {
  contactSessionIdAtomFamily,
  conversationIdAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useInfinitScroll } from "@workspace/ui/hooks/use-infinite.scroll";
import { InfiniteScrollTrigger } from "@workspace/ui/components/infinite-scroll-trigger";

export const WidgetInboxScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIdAtom);
  const organizationId = useAtomValue(organizationIdAtom);
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  );

  const conversations = usePaginatedQuery(
    api.public.conversations.getMany as any,
    contactSessionId ? { contactSessionId } : "skip",
    { initialNumItems: 10 }
  );

  const { topElementRef, handleLoadMore, canLoadMore, isLoadingMore } =
    useInfinitScroll({
      status: conversations.status,
      loadMore: conversations.loadMore,
      loadSize: 10,
    });

  const hasConversations =
    conversations?.results && conversations.results.length > 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20">
      <WidgetHeader>
        <div className="flex items-center gap-x-4 px-4 py-5 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setScreen("selection")}
            className="h-9 w-9 rounded-full shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-x-2 flex-1">
            <Inbox className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold tracking-tight">Inbox</h2>
          </div>
          {hasConversations && (
            <div className="flex items-center justify-center h-6 px-2 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {conversations.results.length}
            </div>
          )}
        </div>
      </WidgetHeader>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />

        {!hasConversations && conversations.status === "LoadingFirstPage" && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">
              Loading conversations...
            </p>
          </div>
        )}

        {!hasConversations && conversations.status !== "LoadingFirstPage" && (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="rounded-full bg-muted p-6">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">No conversations yet</h3>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Your conversations will appear here once you start chatting
              </p>
            </div>
          </div>
        )}

        {hasConversations &&
          conversations.results.map((conversation, index) => (
            <div
              key={conversation._id}
              className="animate-in fade-in slide-in-from-bottom-4 duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Button
                onClick={() => {
                  setConversationId(conversation._id);
                  setScreen("chat");
                }}
                variant="ghost"
                className="w-full h-auto p-4 hover:bg-accent hover:shadow-md transition-all duration-200 group rounded-xl border border-transparent hover:border-border/50"
              >
                <div className="flex w-full flex-col gap-3 text-start">
                  <div className="flex w-full items-center justify-between gap-x-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-primary/60 group-hover:bg-primary transition-colors"></div>
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-muted-foreground uppercase tracking-wide">
                        Chat
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground group-hover:text-muted-foreground">
                      {formatDistanceToNow(
                        new Date(conversation._creationTime),
                        {
                          addSuffix: true,
                        }
                      )}
                    </span>
                  </div>

                  <div className="flex w-full items-start justify-between gap-x-3">
                    <p className="flex-1 truncate text-sm font-medium text-foreground group-hover:text-black dark:group-hover:text-white line-clamp-2">
                      {conversation.lastMessage?.text || "No messages yet"}
                    </p>
                    <div className="shrink-0 pt-0.5">
                      <ConversationStatusIcon
                        status={conversation.status}
                        className="h-5 w-5 transition-transform group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          ))}
      </div>

      <WidgetFooter />
    </div>
  );
};
