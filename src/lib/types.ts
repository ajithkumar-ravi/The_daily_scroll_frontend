export type ReadingStyle = "serious" | "casual" | "genz";

export interface Article {
  title: string;
  description?: string | null;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  source: string;
  author?: string | null;
  content?: string | null;
  topic: string;
}

export interface NewsState {
  userTopics: string[];
  readingStyle: ReadingStyle | null;
  lastFetchTime: string | null;
  cachedArticles: Article[];
}
