import { CHANGE_INPUT, INSERT, REMOVE, Todo, TOGGLE } from './types';
import { TodosAction } from './actions';

type TodosStore = {
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
  action: TodosAction,
): TodosStore {
  switch (action.type) {
    case CHANGE_INPUT:
      return {
        ...state,
        input: action.input!,
      };
    case INSERT:
      return {
        ...state,
        todos: state.todos.concat(action.todo!),
      };
    case TOGGLE:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.id
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
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    default:
      return state;
  }
}
