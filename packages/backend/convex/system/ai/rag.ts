import { cohere } from "@ai-sdk/cohere";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const rag = new RAG(components.rag, {
  // 🔧 FIX: Change model to one that supports your backend's dimensions
  // Option 1: Use embed-english-v3.0 (1024 dimensions) - RECOMMENDED
  textEmbeddingModel: cohere.embedding("embed-english-v3.0"),
  embeddingDimension: 1024, // ✅ Supported dimension

  // Option 2: Use embed-multilingual-v3.0 (1024 dimensions) - agar multi-language support chahiye
  // textEmbeddingModel: cohere.embedding("embed-multilingual-v3.0"),
  // embeddingDimension: 1024,

  // ❌ PURANA (384 dimensions) - NOT SUPPORTED
  // textEmbeddingModel: cohere.embedding("embed-english-light-v3.0"),
  // embeddingDimension: 384,
});

export default rag;
