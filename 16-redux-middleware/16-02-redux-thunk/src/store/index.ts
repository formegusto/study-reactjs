import { combineReducers } from "redux";
import Counter from "./counter";
import Sample from "./sample";

const RootReducer = combineReducers({
  Counter,
  Sample,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
