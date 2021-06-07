import React from 'react';
import { Todo } from '../store/todos/types';

type Props = {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

function TodoItem(props: Props) {
  return (
    <div>
      <input
        type="checkbox"
        checked={props.todo.done}
        onChange={() => props.onToggle(props.todo.id)}
      />
      <span>{props.todo.text}</span>
      <button onClick={() => props.onRemove(props.todo.id)}>X</button>
    </div>
  );
}

export default TodoItem;
