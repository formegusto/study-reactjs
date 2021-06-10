import { handleActions } from "redux-actions";
import { DECREASE, INCREASE } from "./types";

const counterStore = {
  number: 0,
};

export type CounterStore = typeof counterStore;

const CounterReducer = handleActions<CounterStore>(
  {
    [INCREASE]: (state) => ({ number: state.number + 1 }),
    [DECREASE]: (state) => ({ number: state.number - 1 }),
  },
  counterStore
);

export default CounterReducer;
