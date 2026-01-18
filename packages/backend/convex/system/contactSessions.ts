import { ConvexError, v } from "convex/values";
import { internalMutation, internalQuery } from "../_generated/server";

const SESSION_DURATION =24 *60* 60 * 1000;

const AUTO_REFRESH_THRESHHOLD_MS = 4 * 60 * 60 * 1000; // 4 hour
export const refresh = internalMutation({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.db.get(args.contactSessionId);

    if (!contactSession) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Contact Session not found",
      });
    }
    if (contactSession.expiresAt < Date.now()) {
      throw new ConvexError({
        code: "EXPIRED",
        message: "Contact Session has expired",
      });
    }
    const timeRemaining = contactSession.expiresAt - Date.now();

    if (timeRemaining < AUTO_REFRESH_THRESHHOLD_MS) {
      const newExpiresAt = Date.now() + SESSION_DURATION;

      await ctx.db.patch(args.contactSessionId, {
        expiresAt: newExpiresAt,
      });
      return { ...contactSession, expiresAt: newExpiresAt };
    }
    return contactSession
  },
});

export const getOne = internalQuery({
  args: {
    contactSessionId: v.id("contactSessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.contactSessionId);
  },
});
