import { groq } from "@ai-sdk/groq"; // ✅ XAI ki jagah Groq
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  languageModel: groq("llama-3.3-70b-versatile") as any, // ✅ Groq model
  instructions: `You are a helpful customer support assistant.Use "resolveConversation" tool to resolve the conversation when the user's issue is fully addressed. Use "escalateConversation" tool to escalate the conversation to a human operator when the issue requires human intervention or cannot be resolved by you.`,
});
