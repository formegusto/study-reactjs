import { Action, ActionCreator } from 'redux';
import { createAction } from 'redux-actions';
import { CHANGE_INPUT, INSERT, REMOVE, Todo, TOGGLE } from './types';

export type Payload = {
  input?: string;
  id?: number;
  todo?: Todo;
};

export interface TodosAction
  extends Action<
    typeof CHANGE_INPUT | typeof INSERT | typeof TOGGLE | typeof REMOVE
  > {
  payload: Payload;
}

export interface TodosActionCreator extends ActionCreator<TodosAction> {}

let id = 3;

const changeInput = createAction<Payload, string>(
  CHANGE_INPUT,
  (input: string) => ({ input }),
);
const insert = createAction<Payload, string>(INSERT, (text: string) => ({
  todo: {
    id: id++,
    text: text,
    done: false,
  },
}));
const toggle = createAction<Payload, number>(TOGGLE, (id: number) => ({
  id,
}));
const remove = createAction<Payload, number>(TOGGLE, (id: number) => ({
  id,
}));

export const todosActionCreator = {
  changeInput,
  insert,
  toggle,
  remove,
};

/*
export const todosActionCreator: ActionCreatorsMapObject<TodosAction> = {
  changeInput,
  insert: (text: string) => ({
    type: INSERT,
    todo: {
      id: id++,
      text: text,
      done: false,
    },
  }),
  toggle: (id: number) => ({
    type: TOGGLE,
    id,
  }),
  remove: (id: number) => ({
    type: REMOVE,
    id,
  }),
};
*/
