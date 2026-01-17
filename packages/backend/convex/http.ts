import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { createClerkClient, WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";
import { internal } from "./_generated/api";

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY || "",
});
const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const event = await validateRequest(request);

    if (!event) {
      return new Response("Error occured", { status: 400 });
    }
    switch (event.type) {
      case "subscription.updated": {
        const subscription = event.data as {
          status: string;
          payer?: {
            organization_id: string;
          };
        };
        const organizationId = subscription.payer?.organization_id;
        if (!organizationId) {
          return new Response("Missing Organization ID", { status: 400 });
        }
        const newMaxAllowedMemberShips =
          subscription.status === "active" ? 5 : 1;
        await clerkClient.organizations.updateOrganization(organizationId, {
          maxAllowedMemberships: newMaxAllowedMemberShips, //Kitne Members ko hum alow kr sekte hai
        });
        await ctx.runMutation(internal.system.subscriptions.upsert, {
          organizationId,
          status: subscription.status,
        });
        break;
      }
      default:
        console.log("Ignored Clerk Webhook Event", event.type);
    }
    return new Response(null, { status: 200 });
  }),
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const payloadString = await req.text();

  const svixHeaders = {
    "svix-id": req.headers.get("svix-id") || "",
    "svix-timestamp": req.headers.get("svix-timestamp") || "",
    "svix-signature": req.headers.get("svix-signature") || "",
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || "");

  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.log(`Error Verifying Webhook Event`, error);
    return null;
  }
}
export default http;
