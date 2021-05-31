import React, { useCallback } from 'react';
import TodoListItem from './TodoListItem';
import { List, ListRowProps } from 'react-virtualized';
import '../styles/TodoList.scss';
import { Todo } from '../hooks/useTodos';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

function TodoList(props: Props) {
  const rowRenderer = useCallback(
    ({ index, key, style }: ListRowProps) => {
      const todo = props.todos[index];
      return (
        <TodoListItem
          todo={todo}
          key={key}
          onDelete={props.onDelete}
          onToggle={props.onToggle}
          style={style}
        />
      );
    },
    [props],
  );

  return (
    <List
      className="TodoList"
      width={512}
      height={513}
      rowCount={props.todos.length}
      rowHeight={57}
      rowRenderer={rowRenderer}
      list={props.todos}
      style={{ outline: 'none' }}
    />
  );
}

export default React.memo(TodoList);
