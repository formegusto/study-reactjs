import { combineReducers } from "redux";
import counter from "./counter";
import sample from "./sample";
import loading from "./loading";

const RootReducer = combineReducers({
  counter,
  sample,
  loading,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
