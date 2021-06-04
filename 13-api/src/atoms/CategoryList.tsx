import React from 'react';
import { NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { categories } from '../stores/Categories';

/*
type Props = {
  onSelect: (category: string) => void;
  category: string;
};
*/

function CategoryList() {
  return (
    <CategoryListBlock>
      {categories.map((c) => (
        <Category
          key={c.name}
          activeClassName="active"
          to={c.name === 'all' ? '/' : `/${c.name}`}
          exact={c.name === 'all'}
        >
          {c.text}
        </Category>
      ))}
    </CategoryListBlock>
  );
}

type StyleProps = {
  active?: boolean;
};

const CategoryListBlock = styled.div`
  display: flex;
  padding: 1rem;
  width: 768px;
  margin: 0 auto;
  @media screen and (max-width: 768px) {
    width: 100%;
    overflow-x: auto;
  }
`;

const Category = styled(NavLink)<StyleProps>`
  font-size: 1.125rem;
  cursor: pointer;
  white-space: pre;
  text-decoration: none;
  color: inherit;
  padding-bottom: 0.25rem;

  /*
  ${(props) =>
    props.active &&
    css`
      font-weight: 600;
      border-bottom: 2px solid #22b8cf;
      color: #22b8cf;
      &:hover {
        color: #3bc9db;
      }
    `};
    */
  &.active {
    font-weight: 600;
    border-bottom: 2px solid #22b8cf;
    color: #22b8cf;
    &:hover {
      color: #3bc9db;
    }
  }

  &:hover {
    color: #495057;
  }

  & + & {
    margin-left: 1rem;
  }
`;

export default CategoryList;
