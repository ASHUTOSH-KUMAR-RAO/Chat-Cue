import { Vapi, VapiClient } from "@vapi-ai/server-sdk";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { action } from "../_generated/server";
import { getSecretValue, parseSecretString } from "../lib/secrets";

export const getAssistants = action({
  args: { },
  handler: async (ctx):Promise< Vapi.Assistant[]> => {
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
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "VAPI plugin not found for organization",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      publicApiKey: string;
      privateApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Credential not found",
      });
    }
    if (!secretData.publicApiKey || !secretData.privateApiKey) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Incomplete VAPI credentials",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const assistants = await vapiClient.assistants.list();
    return assistants;
  },
});

export const getPhoneNumber = action({
  args: { },
  handler: async (ctx) :Promise<Vapi.ListPhoneNumbersResponseItem[]> => {
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
    const plugin = await ctx.runQuery(
      internal.system.plugins.getByOrganizationIdAndService,
      {
        organizationId: orgId,
        service: "vapi",
      }
    );
    if (!plugin) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "VAPI plugin not found for organization",
      });
    }
    const secretName = plugin.secretName;
    const secretValue = await getSecretValue(secretName);
    const secretData = parseSecretString<{
      publicApiKey: string;
      privateApiKey: string;
    }>(secretValue);

    if (!secretData) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Credential not found",
      });
    }
    if (!secretData.publicApiKey || !secretData.privateApiKey) {
      throw new ConvexError({
        code: "INTERNAL",
        message: "Incomplete VAPI credentials",
      });
    }
    const vapiClient = new VapiClient({
      token: secretData.privateApiKey,
    });
    const phoneNumbers = await vapiClient.phoneNumbers.list();
    return phoneNumbers;
  },
});
