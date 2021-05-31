import React, { useCallback } from 'react';
import TodoComponent from '../components/TodoComponent';
import useTodos, { Todo } from '../hooks/useTodos';

const ManyTodosGenerator = (): Todo[] => {
  const todos = [];
  for (let i = 1; i <= 2500; i++)
    todos.push({
      id: i,
      text: `할 일 ${i}`,
      checked: false,
    });
  return todos;
};

function TodoContainer() {
  const { todos, todoInsert, todoDelete, todoToggle } = useTodos(
    undefined,
    ManyTodosGenerator,
  );

  const onInsert = useCallback(
    (text: string) => {
      todoInsert(text);
    },
    [todoInsert],
  );

  const onDelete = useCallback(
    (id: number) => {
      todoDelete(id);
    },
    [todoDelete],
  );

  const onToggle = useCallback(
    (id: number) => {
      todoToggle(id);
    },
    [todoToggle],
  );

  return (
    <TodoComponent
      todos={todos}
      onInsert={onInsert}
      onDelete={onDelete}
      onToggle={onToggle}
    />
  );
}

export default TodoContainer;
