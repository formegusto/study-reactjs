import { combineReducers } from "redux";
import counter from "./counter";

const RootReducer = combineReducers({
  counter,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
