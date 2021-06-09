import { handleActions } from 'redux-actions';
import { DECREMENT, INCREMENT } from './types';
import produce from 'immer';

type CounterStore = {
  number: number;
};

const countStore = {
  number: 0,
};

export type { CounterStore };

const CountReducer = handleActions<CounterStore>(
  {
    [INCREMENT]: (state) =>
      produce(state, (draft) => {
        draft.number += 1;
      }),
    [DECREMENT]: (state) =>
      produce(state, (draft) => {
        draft.number -= 1;
      }),
  },
  countStore,
);

export default CountReducer;
/*
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
*/
