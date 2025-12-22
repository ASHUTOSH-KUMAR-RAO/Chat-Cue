import { groq } from "@ai-sdk/groq"; // ✅ XAI ki jagah Groq
import { Agent } from "@convex-dev/agent";
import { components } from "../../../_generated/api";
import { SUPPORT_AGENT_PROMPT } from "../constants";

export const supportAgent = new Agent(components.agent, {
  name: "Support Agent",
  languageModel: groq("llama-3.3-70b-versatile") as any, // ✅ Groq model
  instructions: SUPPORT_AGENT_PROMPT,
});
