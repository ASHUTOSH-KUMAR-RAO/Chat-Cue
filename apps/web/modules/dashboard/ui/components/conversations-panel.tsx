"use client";

import {
  getCountaryFlagUrl,
  getCountryFromTimezone,
} from "@/lib/country-utils";
import { api } from "@workspace/backend/_generated/api";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  CornerUpLeftIcon,
  ListIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DicebearAvatar } from "@workspace/ui/components/dicebear-avatar";

import { formatDistanceToNow } from "date-fns";

import { ConversationStatusIcon } from "@workspace/ui/components/conversation-status-icon";
import { useAtomValue, useSetAtom } from "jotai/react";
import { statusFilterAtom } from "../../atoms";
import { Skeleton } from "@workspace/ui/components/skeleton";

export const ConversationsPanel = () => {
  const pathname = usePathname();

  const statusFilter = useAtomValue(statusFilterAtom);

  const setStatusFilter = useSetAtom(statusFilterAtom);
  const rawConversations = useQuery(api.private.conversations.getMany, {
    status: statusFilter === "all" ? undefined : (statusFilter as any),
  });

  const conversations: any[] = Array.isArray(rawConversations)
    ? rawConversations
    : (rawConversations?.page ?? []);

  return (
    <div className="flex h-full w-full flex-col bg-background text-sidebar-foreground">
      {/* Filter Section */}
      <div className="shrink-0 border-b p-2">
        <Select
          defaultValue="all"
          onValueChange={(value) =>
            setStatusFilter(
              value as "unresolved" | "escalated" | "resolved" | "all"
            )
          }
          value={statusFilter}
        >
          <SelectTrigger className="h-8 border-none shadow-none ring-0 hover:bg-accent hover:text-accent-foreground focus-visible:ring-0">
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
          {conversations.map((conversation: any) => {
            const isLastMessageOperator =
              conversation.lastMessage?.message?.role !== "user";

            const country = getCountryFromTimezone(
              conversation.contactSession.metadata?.timezone as any
            );

            const countryFlagUrl = country?.code
              ? getCountaryFlagUrl({ countryCode: country.code })
              : undefined;

            return (
              <Link
                href={`/conversations/${conversation._id}`}
                key={conversation._id}
                className={cn(
                  "relative flex cursor-pointer items-start gap-3 border-b p-4 py-5 text-sm leading-tight hover:bg-accent hover:text-accent-foreground",
                  pathname === `/conversations/${conversation._id}` &&
                    "bg-accent text-accent-foreground"
                )}
              >
                {/* Active indicator line */}
                <div
                  className={cn(
                    "absolute left-0 top-1/2 h-[64%] w-1 -translate-y-1/2 rounded-r-full bg-neutral-300 opacity-0 transition-opacity",
                    pathname === `/conversations/${conversation._id}` &&
                      "opacity-100"
                  )}
                />
                <DicebearAvatar
                  seed={conversation.contactSession._id}
                  badgeImageUrl={countryFlagUrl}
                  className="shrink-0"
                  size={40}
                />
                <div className="flex-1">
                  <div
                    className="flex w-full items-center gap-2
                    "
                  >
                    <span className="truncate font-bold">
                      {conversation.contactSession.name}
                    </span>
                    <span className="ml-auto shrink-0 text-muted-foreground text-xs">
                      {formatDistanceToNow(conversation._creationTime)}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <div className="flex w-0 grow items-center gap-1">
                      {isLastMessageOperator && (
                        <CornerUpLeftIcon className="size-3 shrink-0 text-muted-foreground" />
                      )}
                      <span
                        className={cn(
                          "line-clamp-1 text-muted-foreground text-xs",
                          !isLastMessageOperator && "font-bold text-white"
                        )}
                      >
                        {conversation.lastMessage?.text}
                      </span>
                    </div>
                    <ConversationStatusIcon status={conversation.status} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
