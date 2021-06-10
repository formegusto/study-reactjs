import { DECREASE, INCREASE } from "./types";
import { createAction } from "redux-actions";
import { Dispatch } from "redux";

const increase = createAction(INCREASE);
const decrease = createAction(DECREASE);
const increaseAsync = () => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(increase());
  }, 1000);
};
const decreaseAsync = () => (dispatch: Dispatch) => {
  setTimeout(() => {
    dispatch(decrease());
  }, 1000);
};

const CounterActionCreators = {
  increase,
  decrease,
  increaseAsync,
  decreaseAsync,
};

export default CounterActionCreators;
