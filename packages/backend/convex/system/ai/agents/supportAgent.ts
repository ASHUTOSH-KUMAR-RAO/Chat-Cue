import { groq } from "@ai-sdk/groq"; // ✅ XAI ki jagah Groq
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";

export const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  languageModel: groq("llama-3.3-70b-versatile") as any, // ✅ Groq model
  instructions: "You are a helpful customer support assistant.",
});
