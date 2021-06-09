import { CHANGE_INPUT, INSERT, REMOVE, Todo, TOGGLE } from './types';
import { Payload } from './actions';
import { handleActions } from 'redux-actions';
import produce from 'immer';

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

const todosReducer = handleActions<TodosStore, Payload>(
  {
    [CHANGE_INPUT]: (state, { payload }) =>
    // input은 값 자체이기 때문에 draft 에서 변경 시켜야함
      produce(state, (draft) => {
        draft.input = payload.input!;
      }),
    [INSERT]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        todos.push(payload.todo!);
      }),
    [TOGGLE]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        const todo = todos.find((todo) => todo.id === payload.id);
        todo!.done = !todo?.done;
      }),
    [REMOVE]: (state, { payload }) =>
      produce(state, ({ todos }) => {
        const idx = todos.findIndex((todo) => todo.id === payload.id);
        todos.splice(idx, 1);
      }),
  },
  initialState,
);

export default todosReducer;

/*
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
*/
