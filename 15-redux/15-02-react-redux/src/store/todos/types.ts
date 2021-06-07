export const CHANGE_INPUT = 'todos/CHANGE_INPUT';
export const INSERT = 'todos/INSERT';
export const TOGGLE = 'todos/TOGGLE';
export const REMOVE = 'todos/REMOVE';

export type Todo = {
  id: number;
  text: string;
  done: boolean;
};
