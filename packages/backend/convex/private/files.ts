// ════════════════════════════════════════════════════════════════════════════
// FILE UPLOAD & EMBEDDING CREATION ACTION
// ════════════════════════════════════════════════════════════════════════════
// Purpose: User ki uploaded files ko process karke organization-wise embeddings
//          banata hai for AI-powered semantic search

import {
  contentHashFromArrayBuffer,
  Entry,
  EntryId,
  guessMimeTypeFromContents,
  guessMimeTypeFromExtension,
  vEntryId,
} from "@convex-dev/rag";
import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";
import { Id } from "../_generated/dataModel";
import { action, mutation, query, QueryCtx } from "../_generated/server";
import { extractTextContent } from "../lib/extractTextContent";
import rag from "../system/ai/rag";
import { internal } from "../_generated/api";

// MIME type detection: extension → file contents → fallback
function guessMimeType(filename: string, bytes: ArrayBuffer) {
  return (
    guessMimeTypeFromExtension(filename) ||
    guessMimeTypeFromContents(bytes) ||
    "application/octet-stream"
  );
}

export const deleteFile = mutation({
  args: {
    entryId: vEntryId,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Identity not found",
      });
    }

    // Extract organization ID - used as namespace for data isolation
    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Organization not found",
      });
    }
    const nameSpace = await rag.getNamespace(ctx, { namespace: orgId });
    if (!nameSpace) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Invalid namespace",
      });
    }
    const entry = await rag.getEntry(ctx, {
      entryId: args.entryId,
    });
    if (!entry) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Entry Not Found",
      });
    }
    if (entry.metadata?.uploadedBy !== orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Invalid  Organization Id",
      });
    }
    if (entry.metadata?.storageId) {
      await ctx.storage.delete(entry.metadata.storageId as Id<"_storage">);
    }
    await rag.deleteAsync(ctx, {
      entryId: args.entryId,
    });
  },
});

export const addFile = action({
  args: {
    filename: v.string(),
    mimeType: v.string(),
    bytes: v.bytes(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // ──────────────────────────────────────────────────────────────
    // STEP 1: User Authentication & Organization Verification
    // ──────────────────────────────────────────────────────────────
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Identity not found",
      });
    }

    // Extract organization ID - used as namespace for data isolation
    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Organization not found",
      });
    }
   const subscription = await ctx.runQuery(
      internal.system.subscriptions.getByOrganizationId,
      {
        organizationId: orgId,
      },
    );
    if (subscription?.status !== "active") {
      throw new ConvexError({
        code: "BAD_REQUEST",
        message: "Missing Subscription",
      });
    }
    const { bytes, filename, category } = args;

    // Auto-detect MIME type if not provided
    const mimeType = args.mimeType || guessMimeType(filename, bytes);

    const blob = new Blob([bytes], { type: mimeType });

    // ──────────────────────────────────────────────────────────────
    // STEP 2: Upload file to Convex storage
    // ──────────────────────────────────────────────────────────────
    const storageId = await ctx.storage.store(blob);

    // ──────────────────────────────────────────────────────────────
    // STEP 3: Extract text content from file (PDF/DOCX/TXT etc.)
    // ──────────────────────────────────────────────────────────────
    const text = await extractTextContent(ctx, {
      storageId,
      filename,
      bytes,
      mimeType,
    });

    // ──────────────────────────────────────────────────────────────
    // STEP 4: Create embeddings and store in RAG system
    // ──────────────────────────────────────────────────────────────
    // namespace: orgId ensures each organization's data is isolated
    // Only this org can search/access these embeddings
    const { entryId, created } = await rag.add(ctx, {
      namespace: orgId, // 🔑 Organization-level data isolation
      text, // Text content to be converted into embeddings
      key: filename, // Unique identifier for this document
      title: filename, // Display name
      metadata: {
        storageId, // Link to original file in Convex storage
        uploadedBy: orgId, // Track who uploaded
        filename, // Original filename
        category: category ?? null, // Optional categorization (e.g., "finance")
      } as EntryMetadata,
      contentHash: await contentHashFromArrayBuffer(bytes), // Prevent duplicate uploads
    });
    if (!created) {
      console.debug("Entry Already Exist,Skipping Upload Metadata");
      await ctx.storage.delete(storageId);
    }
    return {
      url: await ctx.storage.getUrl(storageId),
      entryId,
    };
  },
});

export const list = query({
  args: {
    category: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (identity === null) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Identity not found",
      });
    }

    // Extract organization ID - used as namespace for data isolation
    const orgId = identity.orgId as string;

    if (!orgId) {
      throw new ConvexError({
        code: "UNATHORIZED",
        message: "Organization not found",
      });
    }
    const nameSpace = await rag.getNamespace(ctx, {
      namespace: orgId,
    });
    if (!nameSpace) {
      return { page: [], isDone: true, continueCursor: "" };
    }
    const result = await rag.list(ctx, {
      namespaceId: nameSpace.namespaceId,
      paginationOpts: args.paginationOpts,
    });

    const files = await Promise.all(
      result.page.map((entry) => convertEntryToPublicFile(ctx, entry))
    );

    const filterdFiles = args.category
      ? files.filter((file) => file.category === args.category)
      : files;

    return {
      page: filterdFiles,
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export type PublicFile = {
  id: EntryId;
  name: string;
  type: string;
  size: string;
  status: "ready" | "processing" | "error";
  url: string | null;
  category?: string;
};

type EntryMetadata = {
  storageId: Id<"_storage">;
  uploadedBy: string;
  filename: string;
  category: string | null;
};
async function convertEntryToPublicFile(
  ctx: Pick<QueryCtx, "db" | "storage">,
  entry: Entry
): Promise<PublicFile> {
  const metadata = entry.metadata as EntryMetadata | undefined;
  const storageId = metadata?.storageId;

  let fileSize = "unknown";

  if (storageId) {
    try {
      const storageMetadata = await ctx.db.system.get(storageId);
      if (storageMetadata) {
        fileSize = formatFileSize(storageMetadata.size);
      }
    } catch (error) {
      console.error("Failed to get storage metadata: ", error);
    }
  }

  const fileName = entry.key || "unknown";
  const extension = fileName.split(".").pop()?.toLowerCase() || "txt";

  let status: "ready" | "processing" | "error" = "error";

  if (entry.status === "ready") {
    status = "ready";
  } else if (entry.status === "pending") {
    status = "processing";
  }

  const url = storageId ? await ctx.storage.getUrl(storageId) : null;

  return {
    id: entry.entryId,
    name: fileName,
    type: extension,
    size: fileSize,
    status,
    url,
    category: metadata?.category || undefined,
  };
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return "0 B";
  }

  const k = 1024;

  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
}
