export interface SearchResult {
  filePath: string;
  title: string;
  excerpt: string;
  tags: string[];
  score: number;
}

export interface SearchQuery {
  text: string;
  tags: string[];
}
