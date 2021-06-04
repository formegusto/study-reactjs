import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import NewsList from './atoms/NewsList';
import { Article, Articles } from './common/Types';

function App() {
  const [articles, setArticles] = useState<Article[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get<Articles>(
          `https://newsapi.org/v2/top-headlines?country=kr&apiKey=${process.env.REACT_APP_API_KEY}`,
        );
        setArticles(res.data.articles);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <NewsListBlock>대기 중...</NewsListBlock>;

  return (
    articles && (
      <NewsListBlock>
        <NewsList articles={articles} />
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
  @media screen and(max-width: 768px) {
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

export default App;
