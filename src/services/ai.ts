/**
 * AI service stub — post-MVP.
 * This interface will be implemented to support:
 *  - Note summarization (Anthropic / OpenAI / local Ollama)
 *  - Auto-tagging
 *  - Embeddings for semantic search
 *
 * Results are stored in note frontmatter fields:
 *  summary, embeddings_version
 */

export interface AISummaryResult {
  summary: string;
  model: string;
  generatedAt: string;
}

export interface AITagResult {
  tags: string[];
  model: string;
  generatedAt: string;
}

// These will throw until implemented in a future phase
export async function summarizeNote(_content: string): Promise<AISummaryResult> {
  throw new Error("AI summarization not yet implemented");
}

export async function autoTagNote(_content: string): Promise<AITagResult> {
  throw new Error("AI auto-tagging not yet implemented");
}
