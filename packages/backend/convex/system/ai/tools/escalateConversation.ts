import z from "zod";

import { createTool } from "@convex-dev/agent";

import { internal } from "../../../_generated/api";

import { supportAgent } from "../agents/supportAgent";

export const escalateConversation = createTool({
  description: "Escalate a Conversation",
  args: z.object({}),
  handler: async (ctx) => {
    if (!ctx.threadId) {
      return "Missing Thread ID";
    }
    await ctx.runMutation(internal.system.conversations.escalate, {
      threadId: ctx.threadId,
    });

    await supportAgent.saveMessage(ctx, {
      threadId: ctx.threadId,
      message: {
        role: "assistant",
        content: "The conversation has been escalated to the human operator.",
      },
    });
    return "The conversation has been escalated to a human operator . successfully.";
  },
});
