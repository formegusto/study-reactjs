import React from 'react';
import TodoListItem from './TodoListItem';
import '../styles/TodoList.scss';
import { Todo } from '../hooks/useTodos';

type Props = {
  todos: Todo[];
};

function TodoList(props: Props) {
  return (
    <div className="TodoList">
      {props.todos.map((todo, idx) => (
        <TodoListItem todo={todo} />
      ))}
    </div>
  );
}

export default TodoList;
