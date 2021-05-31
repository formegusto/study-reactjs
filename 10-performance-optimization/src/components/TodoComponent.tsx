import React from 'react';
import TodoForm from '../atoms/TodoForm';
import TodoList from '../atoms/TodoList';
import { Todo } from '../hooks/useTodos';
import TodoTemplate from '../templates/TodoTemplate';

type Props = {
  todos: Todo[];
  onInsert: (text: string) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TodoComponent(props: Props) {
  return (
    <TodoTemplate>
      <TodoForm onInsert={props.onInsert} />
      <TodoList
        todos={props.todos}
        onDelete={props.onDelete}
        onToggle={props.onToggle}
      />
    </TodoTemplate>
  );
}

export default TodoComponent;
