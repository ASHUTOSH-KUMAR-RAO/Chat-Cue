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
    <div className="flex flex-col h-full bg-background">
      <WidgetHeader>
        <div className="flex items-center gap-x-4 px-4 py-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setScreen("selection")}
            className="h-9 w-9 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-x-2 flex-1">
            <Inbox className="h-5 w-5 text-foreground" />
            <h2 className="text-lg font-semibold">Inbox</h2>
          </div>
          {hasConversations && (
            <div className="h-6 px-2.5 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center">
              {conversations.results.length}
            </div>
          )}
        </div>
      </WidgetHeader>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5">
        <InfiniteScrollTrigger
          canLoadMore={canLoadMore}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleLoadMore}
          ref={topElementRef}
        />

        {!hasConversations && conversations.status === "LoadingFirstPage" && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            <p className="text-sm text-muted-foreground">
              Loading conversations...
            </p>
          </div>
        )}

        {!hasConversations && conversations.status !== "LoadingFirstPage" && (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="rounded-full bg-muted/50 p-5">
              <MessageSquare className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold">No conversations yet</h3>
              <p className="text-sm text-muted-foreground max-w-[240px]">
                Your conversations will appear here once you start chatting
              </p>
            </div>
          </div>
        )}

        {hasConversations &&
          conversations.results.map((conversation) => (
            <Button
              key={conversation._id}
              onClick={() => {
                setConversationId(conversation._id);
                setScreen("chat");
              }}
              variant="ghost"
              className="w-full h-auto p-3.5 hover:bg-accent transition-colors rounded-lg"
            >
              <div className="flex w-full flex-col gap-2.5 text-start">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary/70"></div>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Chat
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(conversation._creationTime), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <div className="flex w-full items-start justify-between gap-x-3">
                  <p className="flex-1 text-sm font-medium text-foreground line-clamp-2 text-left">
                    {conversation.lastMessage?.text || "No messages yet"}
                  </p>
                  <div className="shrink-0 pt-0.5">
                    <ConversationStatusIcon
                      status={conversation.status}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </Button>
          ))}
      </div>

      <WidgetFooter />
    </div>
  );
};
