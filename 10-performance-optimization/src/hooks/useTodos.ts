import React from 'react';

interface Action extends String {
  payload: Todo;
}

export type Todo = {
  id: number;
  text: string;
  checked: boolean;
};

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action) {
    default:
      return state;
  }
}

export default function useTodos(initialTodos: Todo[]) {
  const [todos] = React.useReducer(reducer, initialTodos);

  return { todos };
}
