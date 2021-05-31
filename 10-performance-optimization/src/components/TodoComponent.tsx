import React from 'react';
import TodoForm from '../atoms/TodoForm';
import TodoList from '../atoms/TodoList';
import TodoTemplate from '../templates/TodoTemplate';

function TodoComponent() {
  return (
    <TodoTemplate>
      <TodoForm />
      <TodoList />
    </TodoTemplate>
  );
}

export default TodoComponent;
