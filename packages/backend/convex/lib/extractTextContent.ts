/*
    RAG SYSTEM - DOCUMENT PROCESSING PIPELINE

    Flow: File Upload → Extract Text → Store in DB → AI Responses

    Supported Files:
    - Images (JPEG, PNG, WebP, GIF) → OCR (Optical Character Recognition),images se text ko extract krta hai
      Reality Check: "AI Vision" = Advanced OCR with Deep Learning
    - PDFs → Text extraction via AI
    - Text/HTML → Markdown conversion

    Fun Fact: OCR technology 1990s se hai, ab bas "AI Models" ke fancy naam se
    market kar rahe hain. Core concept same, implementation smarter! 🎯
*/

import { generateText } from "ai";  
import { groq } from "@ai-sdk/groq";
import type { StorageActionWriter } from "convex/server";
import { assert } from "convex-helpers";
import { Id } from "../_generated/dataModel";

// AI Models - Using Groq's Llama 3.3 70B for all tasks
// Reality: Ye models internally traditional techniques ka advanced version use karte hain
const AI_MODELS = {
  image: groq("llama-3.3-70b-versatile"), // Modern OCR implementation
  pdf: groq("llama-3.3-70b-versatile"), // Text extraction algorithms
  html: groq("llama-3.3-70b-versatile"), // Pattern matching + parsing
} as const;

// Supported image formats for OCR
const SUPPORTED_IMAGE_TYPE = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

// System prompts for AI processing
const SYSTEM_PROMPT = {
  image:
    "you turn images into text. If it is a photo of a document, transcribe it. If it is not a document, describe it",
  pdf: "You transform pdf file into text",
  html: "You transform content into markdown",
};

export type extractTextContentArgs = {
  storageId: Id<"_storage">;
  filename: string;
  bytes?: ArrayBuffer;
  mimeType: string;
};

/**
 * Main function - routes file processing based on MIME type
 */
export async function extractTextContent(
  ctx: { storage: StorageActionWriter },
  args: extractTextContentArgs
): Promise<string> {
  const { storageId, filename, bytes, mimeType } = args;

  const url = await ctx.storage.getUrl(storageId);
  assert(url, "Failed to Get Storage Url");

  // Route to appropriate extractor
  if (SUPPORTED_IMAGE_TYPE.some((type) => type === mimeType)) {
    return extractImageText(url);
  }

  if (mimeType.toLowerCase().includes("pdf")) {
    return extractPdfText(ctx, storageId, bytes, filename);
  }

  if (mimeType.toLowerCase().includes("text")) {
    return extractTextFileContent(ctx, storageId, bytes, mimeType);
  }

  throw new Error(`Unsupported MIME type: ${mimeType}`);
}

/**
 * Processes text/HTML files - converts HTML to markdown if needed
 */
async function extractTextFileContent(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  mimeType: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get File content");
  }

  const text = new TextDecoder().decode(arrayBuffer);

  // Convert HTML to markdown using AI
  if (mimeType.toLowerCase() !== "text/plain") {
    const result = await generateText({
      model: AI_MODELS.html,
      system: SYSTEM_PROMPT.html,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text },
            {
              type: "text",
              text: "Extract the text and print it in a markdown format without explaining you'll do so",
            },
          ],
        },
      ],
    });
    return result.text;
  }

  return text;
}

/**
 * Extracts text from PDF files
 * Process: PDF → ArrayBuffer → Base64 → AI Extraction
 *
 * Behind the Scenes: Ye "AI" actually PDF parsing algorithms use kar raha hai
 * jo decades se exist karte hain, bas ab neural networks se better ho gaye
 */
async function extractPdfText(
  ctx: { storage: StorageActionWriter },
  storageId: Id<"_storage">,
  bytes: ArrayBuffer | undefined,
  filename: string
): Promise<string> {
  const arrayBuffer =
    bytes || (await (await ctx.storage.get(storageId))?.arrayBuffer());

  if (!arrayBuffer) {
    throw new Error("Failed to get PDF content");
  }

  // Convert to base64 for AI processing
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString("base64");

  const result = await generateText({
    model: AI_MODELS.pdf,
    system: SYSTEM_PROMPT.pdf,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I have a PDF file named "${filename}". Here is the base64 encoded content:\n\n${base64Data.substring(0, 1000)}...\n\nExtract the text from this PDF and print without explaining you'll do so`,
          },
        ],
      },
    ],
  });

  return result.text;
}

/**
 * Extracts text from images using OCR/Vision AI
 *
 * Reality Check:
 * - Marketing: "AI Vision Model" 🤖
 * - Reality: Advanced OCR (Optical Character Recognition) 📸→📝
 *
 * OCR technology 1990s se hai, difference sirf ye hai ki:
 * Old OCR: Rule-based pattern matching (limited accuracy)
 * Modern "AI": Deep Learning + Neural Networks (high accuracy)
 *
 * Core concept same hai - images se text padhna!
 * Bas implementation smarter ho gaya hai. Fancy naam marketing ke liye! 😄
 */
async function extractImageText(url: string): Promise<string> {
  const result = await generateText({
    model: AI_MODELS.image, // Fancy term for: "Advanced OCR Engine"
    system: SYSTEM_PROMPT.image,
    messages: [
      {
        role: "user",
        content: [{ type: "image", image: new URL(url) }],
      },
    ],
  });

  return result.text;
}

/*
    Key Takeaway:
    ============
    "AI Models" = Old technologies + Better algorithms + More data + Fancy marketing

    OCR (1990s) → Deep Learning (2010s) → "AI Vision" (2020s) → Same concept, better results!
*/
