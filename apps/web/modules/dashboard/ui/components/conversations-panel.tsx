"use client";

import { getCountryFlagUrl, getCountryFromTimezone } from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";

import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

import { formatDistanceToNow } from "date-fns";

import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";

const ITEMS_PER_PAGE = 10;

export const ConversationsPanel = () => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);
  const setStatusFilter = useSetAtom(statusFilterAtom);

  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const rawConversations = useQuery(api.private.conversations.getMany, {
    status: statusFilter === "all" ? undefined : (statusFilter as any),
  });

  const allConversations: any[] = Array.isArray(rawConversations)
    ? rawConversations
    : (rawConversations?.page ?? []);

  // Client-side pagination
  const displayedConversations = useMemo(() => {
    return allConversations.slice(0, displayCount);
  }, [allConversations, displayCount]);

  const hasMore = displayCount < allConversations.length;
  const isLoading = rawConversations === undefined;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  // Reset display count when filter changes
  const handleFilterChange = (value: string) => {
    setDisplayCount(ITEMS_PER_PAGE);
    setStatusFilter(value as "unresolved" | "escalated" | "resolved" | "all");
  };

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      {/* Filter Section */}
      <div className="shrink-0 border-b p-2.5">
        <Select
          defaultValue="all"
          onValueChange={handleFilterChange}
          value={statusFilter}
        >
          <SelectTrigger className="h-9 border-none shadow-none ring-0 hover:bg-accent/50">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <div className="flex items-center gap-2">
                <ListIcon className="size-4" />
                <span>All</span>
              </div>
            </SelectItem>
            <SelectItem value="unresolved">
              <div className="flex items-center gap-2">
                <ArrowRightIcon className="size-4" />
                <span>Unresolved</span>
              </div>
            </SelectItem>
            <SelectItem value="escalated">
              <div className="flex items-center gap-2">
                <ArrowUpIcon className="size-4" />
                <span>Escalated</span>
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckIcon className="size-4" />
                <span>Resolved</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1">
        <div className="flex w-full flex-col">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && allConversations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <ListIcon className="size-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                No conversations found
              </p>
              <p className="mt-2 max-w-[250px] text-sm text-muted-foreground">
                Try changing your filter to see more conversations
              </p>
            </div>
          )}

          {/* Conversations */}
          {!isLoading &&
            displayedConversations.map((conversation: any) => {
              const isLastMessageOperator =
                conversation.lastMessage?.message?.role !== "user";

              const timezone = conversation.contactSession.metadata?.timezone;
              const country = getCountryFromTimezone({ timezone });
              const countryFlagUrl = country?.code
                ? getCountryFlagUrl({ countryCode: country.code })
                : undefined;

              const isActive =
                pathname === `/conversations/${conversation._id}`;

              return (
                <Link
                  href={`/conversations/${conversation._id}`}
                  key={conversation._id}
                  className={cn(
                    "group relative flex cursor-pointer items-start gap-3 border-b p-4 transition-all hover:bg-accent/80",
                    isActive && "bg-accent/50"
                  )}
                >
                  {/* Active Indicator */}
                  <div
                    className={cn(
                      "absolute left-0 top-1/2 h-[70%] w-1 -translate-y-1/2 rounded-r-full bg-primary opacity-0 transition-opacity",
                      isActive && "opacity-100"
                    )}
                  />

                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <DicebearAvatar
                      seed={conversation.contactSession._id}
                      badgeImageUrl={countryFlagUrl ?? undefined}
                      className="shrink-0"
                      size={40}
                    />
                  </div>

                  {/* Content Section */}
                  <div className="flex-1 overflow-hidden">
                    <div className="flex w-full items-center gap-2">
                      <span
                        className={cn(
                          "truncate font-semibold",
                          isActive ? "text-foreground" : "text-foreground/90"
                        )}
                      >
                        {conversation.contactSession.name}
                      </span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                        {formatDistanceToNow(conversation._creationTime)}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <div className="flex w-0 grow items-center gap-1.5">
                        {isLastMessageOperator && (
                          <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                        )}
                        <span
                          className={cn(
                            "line-clamp-1 text-xs",
                            !isLastMessageOperator
                              ? "font-bold text-foreground"
                              : "text-muted-foreground"
                          )}
                        >
                          {conversation.lastMessage?.text}
                        </span>
                      </div>

                      {/* Status Icon */}
                      <ConversationStatusIcon status={conversation.status} />
                    </div>
                  </div>
                </Link>
              );
            })}

          {/* Total Count Display - Before Load More */}
          {!isLoading && allConversations.length > 0 && (
            <div className="flex items-center justify-center border-b p-3 text-xs text-muted-foreground">
              Showing {displayedConversations.length} of{" "}
              {allConversations.length} conversations
            </div>
          )}

          {/* Load More Button - At Bottom */}
          {!isLoading && hasMore && (
            <div className="flex items-center justify-center p-4">
              <Button
                onClick={handleLoadMore}
                variant="ghost"
                size="sm"
                className="w-full hover:bg-accent"
              >
                <span className="mr-2">Load More</span>
                <span className="text-xs text-muted-foreground">
                  ({allConversations.length - displayCount} remaining)
                </span>
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
