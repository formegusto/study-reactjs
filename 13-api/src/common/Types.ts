type Articles = {
  status: string;
  totalResults: number;
  articles: Article[];
};

type Article = {
  source: Source;
  author: null | string;
  title: string;
  description: null | string;
  url: string;
  urlToImage: null | string;
  publishedAt: Date;
  content: null | string;
};

type Source = {
  id: null | string;
  name: string;
};

type Category = {
  name: string;
  text: string;
};

export type { Articles, Article, Source, Category };
