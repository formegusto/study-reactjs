import React from 'react';
import TodoForm from '../atoms/TodoForm';
import TodoList from '../atoms/TodoList';
import { Todo } from '../hooks/useTodos';
import TodoTemplate from '../templates/TodoTemplate';

type Props = {
  todos: Todo[];
};

function TodoComponent(props: Props) {
  return (
    <TodoTemplate>
      <TodoForm />
      <TodoList todos={props.todos} />
    </TodoTemplate>
  );
}

export default TodoComponent;
