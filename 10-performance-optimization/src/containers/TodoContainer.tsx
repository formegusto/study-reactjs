import React from 'react';
import TodoComponent from '../components/TodoComponent';
import useTodos from '../hooks/useTodos';

function TodoContainer() {
  const { todos } = useTodos([
    {
      id: 1,
      text: '리액트의 기초 알아보기',
      checked: true,
    },
    {
      id: 2,
      text: '컴포넌트 스타일링해 보기',
      checked: true,
    },
    {
      id: 3,
      text: '일정 관리 앱 만들어 보기',
      checked: false,
    },
  ]);

  return <TodoComponent todos={todos} />;
}

export default TodoContainer;
