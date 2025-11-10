import { v } from "convex/values";
import { mutation } from "../_generated/server";

const SESSION_DURATION = 24 * 60 * 60 * 1000; // Basically hum 24 hours ko millisecond mein convert kiya hai

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    metadata: v.optional(
      v.object({
        userAgent: v.optional(v.string()),
        language: v.optional(v.string()),
        languages: v.optional(v.string()),
        platform: v.optional(v.string()),
        vendor: v.optional(v.string()),
        screenResolution: v.optional(v.string()),
        viewportSize: v.optional(v.string()),
        timezone: v.optional(v.string()),
        timezoneOffset: v.optional(v.number()),
        cookieEnabled: v.optional(v.boolean()),
        referrer: v.optional(v.string()),
        currentUrl: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const expiresAt = now + SESSION_DURATION;

    const contactSessionId = await ctx.db.insert("contactSessions", {
      name: args.name,
      email: args.email,
      metadata: args.metadata,
      organizationId: args.organizationId,
      expiresAt,
    }); //! aur pta hai jo yeha per ctx.db.insert likha hai n ye always Id hi return krega isiliye hamne varibale ka name contactSessiosId rakha hai
    return contactSessionId;
  },
});
