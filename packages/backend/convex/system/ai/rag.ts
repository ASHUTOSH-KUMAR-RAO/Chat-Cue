import { cohere } from "@ai-sdk/cohere";
import { RAG } from "@convex-dev/rag";
import { components } from "../../_generated/api";

const rag = new RAG(components.rag, {
  textEmbeddingModel: cohere.embedding("embed-english-light-v3.0"),
  embeddingDimension: 384,
});

export default rag
