import { CHANGE_INPUT, INSERT, REMOVE, Todo, TOGGLE } from './types';
import { TodosAction } from './actions';

export type TodosStore = {
  input: string;
  todos: Todo[];
};

const initialState: TodosStore = {
  input: '',
  todos: [
    {
      id: 1,
      text: '리덕스 기초 배우기',
      done: true,
    },
    {
      id: 2,
      text: '리액트의 리덕스 사용하기',
      done: false,
    },
  ],
};

export default function todosReducer(
  state = initialState,
  { type, payload }: TodosAction,
): TodosStore {
  switch (type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: payload.input!,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(payload.todo!),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === payload.id
            ? {
                ...todo,
                done: !todo.done,
              }
            : todo,
        ),
      };
    case REMOVE:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== payload.id),
      };
    default:
      return state;
  }
}
