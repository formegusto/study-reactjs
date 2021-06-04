import axios from 'axios';
import React from 'react';
import styled from 'styled-components';
import { Articles } from '../common/Types';
import usePromise from '../lib/usePromise';
import NewsItem from './NewsItem';

type Props = {
  category: string;
};

function NewsList({ category }: Props) {
  const [loading, response, error] = usePromise<Articles>(() => {
    const query = category === 'all' ? '' : `&category=${category}`;
    return axios.get<Articles>(
      `https://newsapi.org/v2/top-headlines?country=kr${query}&apiKey=${process.env.REACT_APP_API_KEY}`,
    );
  }, [category]);

  if (loading) return <NewsListBlock>대기 중...</NewsListBlock>;

  if (!response) return null;

  if (error) return <NewsListBlock>에러발생!</NewsListBlock>;

  const { articles } = response.data;

  return (
    articles && (
      <NewsListBlock>
        {articles.map((article) => (
          <NewsItem article={article} key={article.url} />
        ))}
      </NewsListBlock>
    )
  );
}

const NewsListBlock = styled.div`
  box-sizing: border-box;
  padding-bottom: 3rem;
  width: 768px;
  margin: 0 auto;
  margin-top: 2rem;
  @media screen and (max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export default NewsList;
