import { combineReducers } from "redux";
import users from "./users";

const RootReducer = combineReducers({ users });

export type RootStore = ReturnType<typeof RootReducer>;
export default RootReducer;
