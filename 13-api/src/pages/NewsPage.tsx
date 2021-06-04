import React from 'react';
import { RouteComponentProps } from 'react-router';
import CategoryList from '../atoms/CategoryList';
import NewsList from '../atoms/NewsList';

type Params = {
  category: string;
};

function NewsPage({ match }: RouteComponentProps<Params>) {
  const category = match.params.category || 'all';
  return (
    <>
      <CategoryList />
      <NewsList category={category} />
    </>
  );
}

export default NewsPage;
