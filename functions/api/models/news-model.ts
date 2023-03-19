export interface INews {
  status: string;
  totalResults: number;
  articles: IArticle[];
}

export interface IArticle {
  source: {
    id: string;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  content: string;
}
