import { handleActions } from "redux-actions";
import { DECREASE, INCREASE } from "./types";

const CounterStore = 0;

const CounterReducer = handleActions<number>(
  {
    [INCREASE]: (state) => state + 1,
    [DECREASE]: (state) => state - 1,
  },
  CounterStore
);
export default CounterReducer;
