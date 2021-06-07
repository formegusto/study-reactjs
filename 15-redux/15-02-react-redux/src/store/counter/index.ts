import { CounterActions } from './actions';
import { DECREMENT, INCREMENT } from './types';

type CounterStore = {
  number: number;
};

const countStore = {
  number: 0,
};

export type { CounterStore };

export default function CountReducer(
  state = countStore,
  action: CounterActions,
): CounterStore {
  switch (action.type) {
    case INCREMENT:
      return {
        number: state.number + 1,
      };
    case DECREMENT:
      return {
        number: state.number - 1,
      };
    default:
      return state;
  }
}
