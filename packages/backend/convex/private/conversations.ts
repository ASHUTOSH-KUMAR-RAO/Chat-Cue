import { MessageDoc } from "@convex-dev/agent";
import { ConvexError, v } from "convex/values";
import { Doc } from "../_generated/dataModel";
import { query } from "../_generated/server";
import { supportAgent } from "../system/ai/agents/supportAgent";

export const getOne = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx: any, arg: any) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Organization not found",
      });
    }

    const conversation = await ctx.db.get(arg.conversationId);

    if (!conversation) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Conversation not Found",
      });
    }

    if (conversation.organizationId !== orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Invalid Organization Id",
      });
    }

    const contactSession = await ctx.db.get(conversation.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact Session not Found",
      });
    }

    return {
      ...conversation,
      contactSession,
    };
  },
})

export const getMany = query({
  args: {
    status: v.optional(
      v.union(
        v.literal("unresolved"),
        v.literal("escalated"),
        v.literal("resolved")
      )
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Identity not found",
      });
    }

    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Organization not found",
      });
    }

    // Query builder
    let conversationsQuery: any = ctx.db.query("conversations");

    if (args.status) {
      conversationsQuery = conversationsQuery.withIndex(
        "by_status_and_organization_id",
        (q: any) => q.eq("status", args.status!).eq("organizationId", orgId)
      );
    } else {
      conversationsQuery = conversationsQuery.withIndex(
        "by_organization_id",
        (q: any) => q.eq("organizationId", orgId)
      );
    }

    // Changed from paginate(ctx) to collect()
    const conversations = await conversationsQuery.order("desc").collect();

    const conversationWithAdditionalData = await Promise.all(
      conversations.map(async (conversation: Doc<"conversations">) => {
        let lastMessage: MessageDoc | null = null;
        const contactSession = await ctx.db.get(conversation.contactSessionId);

        if (!contactSession) {
          return null;
        }

        const messages = await supportAgent.listMessages(ctx, {
          threadId: conversation.threadId,
          paginationOpts: { numItems: 1, cursor: null },
        });

        if (messages.page.length > 0) {
          lastMessage = messages.page[0] ?? null;
        }

        return {
          ...conversation,
          lastMessage,
          contactSession,
        };
      })
    );

    const validConversations = conversationWithAdditionalData.filter(
      (conv): conv is NonNullable<typeof conv> => conv != null
    );

    // Updated return format
    return {
      page: validConversations,
      isDone: true,
      continueCursor: null,
    };
  },
});
