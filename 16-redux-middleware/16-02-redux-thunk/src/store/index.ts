import { combineReducers } from "redux";
import Counter from "./counter";

const RootReducer = combineReducers({
  Counter,
});

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
