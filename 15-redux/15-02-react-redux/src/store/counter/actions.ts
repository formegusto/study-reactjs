import { createAction } from 'redux-actions';
import { DECREMENT, INCREMENT } from './types';

export type CounterAction = {
  type: string;
};

export const counterActions = {
  increase: createAction(INCREMENT),
  decrease: createAction(DECREMENT),
};

export type CounterActions =
  | ReturnType<typeof counterActions.increase>
  | ReturnType<typeof counterActions.decrease>;
