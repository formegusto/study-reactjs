import { CounterActions } from './types';

export const CounterActionCreators = {
  increase: () => ({ type: CounterActions.INCREMENT }),
  decrease: () => ({ type: CounterActions.DECREMENT }),
};

export type CounterActionCreator =
  | ReturnType<typeof CounterActionCreators.increase>
  | ReturnType<typeof CounterActionCreators.decrease>;
