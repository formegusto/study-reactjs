import { CounterActions, CounterActionType } from './types';

type CounterStore = {
  number: number;
};

const countStore = {
  number: 0,
};

export type { CounterStore };

export default function CountReducer(
  state = countStore,
  action: CounterActionType,
): CounterStore {
  switch (action.type) {
    case CounterActions.INCREMENT:
      return {
        number: state.number + 1,
      };
    case CounterActions.DECREMENT:
      return {
        number: state.number - 1,
      };
    default:
      return state;
  }
}
