import { combineReducers } from "redux";
import Counter from "./counter";
import Sample from "./sample";
import Loading from "./loading";

const RootReducer = combineReducers({
  Counter,
  Sample,
  Loading,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
