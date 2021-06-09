import { DECREASE, INCREASE } from "./types";
import { createAction } from "redux-actions";

const increase = createAction(INCREASE);
const decrease = createAction(DECREASE);

const CounterActionCreators = {
  increase,
  decrease,
};

export default CounterActionCreators;
