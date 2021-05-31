import React, { useCallback } from 'react';

const INSERT_TODO = 'todos/insert';
const DELETE_TODO = 'todos/update';
const TOGGLE_TODO = 'todos/toggle';

interface Action {
  type: typeof INSERT_TODO | typeof DELETE_TODO | typeof TOGGLE_TODO;
  payload: string | number;
}

export type Todo = {
  id: number;
  text: string;
  checked: boolean;
};

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case INSERT_TODO:
      return state.concat({
        id: state[state.length - 1].id + 1,
        checked: false,
        text: action.payload as string,
      });
    case DELETE_TODO:
      return state.filter((todo) => todo.id !== (action.payload as number));
    case TOGGLE_TODO:
      return state.map((todo) =>
        todo.id === (action.payload as number)
          ? { ...todo, checked: !todo.checked }
          : todo,
      );
    default:
      return state;
  }
}

/*
  usage
    has initState
    useTodos(stateTodos, undefined)

    has stateGenerator
    useTodos(undefine, stateGenerator)
*/
export default function useTodos(
  initialTodos?: Todo[],
  todosGenerator?: () => Todo[],
) {
  const [todos, dispatch] = React.useReducer(
    reducer,
    initialTodos,
    todosGenerator!,
  );

  const todoInsert = useCallback((text: string) => {
    dispatch({
      type: INSERT_TODO,
      payload: text,
    });
  }, []);

  const todoDelete = useCallback((id: number) => {
    dispatch({
      type: DELETE_TODO,
      payload: id,
    });
  }, []);

  const todoToggle = useCallback((id: number) => {
    dispatch({
      type: TOGGLE_TODO,
      payload: id,
    });
  }, []);

  return { todos, todoInsert, todoDelete, todoToggle };
}
