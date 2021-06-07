import { DECREMENT, INCREMENT } from './types';

export type CounterAction = {
  type: string;
};

export const counterActions = {
  increase: () => ({ type: INCREMENT }),
  decrease: () => ({ type: DECREMENT }),
};

export type CounterActions =
  | ReturnType<typeof counterActions.increase>
  | ReturnType<typeof counterActions.decrease>;
