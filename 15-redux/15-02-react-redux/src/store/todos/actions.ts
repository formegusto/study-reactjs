import { Action, ActionCreator, ActionCreatorsMapObject } from 'redux';
import { CHANGE_INPUT, INSERT, REMOVE, Todo, TOGGLE } from './types';

export interface TodosAction
  extends Action<
    typeof CHANGE_INPUT | typeof INSERT | typeof TOGGLE | typeof REMOVE
  > {
  input?: string;
  id?: number;
  todo?: Todo;
}

export interface TodosActionCreator extends ActionCreator<TodosAction> {}

let id = 3;

export const todosActionCreator: ActionCreatorsMapObject<TodosAction> = {
  changeInput: (input: string) => ({ type: CHANGE_INPUT, input }),
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
