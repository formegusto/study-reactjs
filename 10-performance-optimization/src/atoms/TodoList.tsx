import React from 'react';
import TodoListItem from './TodoListItem';
import '../styles/TodoList.scss';
import { Todo } from '../hooks/useTodos';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TodoList(props: Props) {
  return (
    <div className="TodoList">
      {props.todos.map((todo) => {
        return (
          <TodoListItem
            todo={todo}
            key={todo.id}
            onDelete={props.onDelete}
            onToggle={props.onToggle}
          />
        );
      })}
    </div>
  );
}

export default TodoList;
