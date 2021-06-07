import React from 'react';
import TodoItem from '../atoms/TodoItem';
import { Todo } from '../store/todos/types';

type Props = {
  input: string;
  todos: Todo[];
  onChange: (input: string) => void;
  onInsert: (text: string) => void;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
};

function TodosComponent(props: Props) {
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    props.onInsert(props.input);
    props.onChange('');
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            props.onChange(e.target.value)
          }
          value={props.input}
        />
        <button type="submit">등록</button>
      </form>
      <div>
        {props.todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onRemove={props.onRemove}
            onToggle={props.onToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default TodosComponent;
