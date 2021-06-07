import { combineReducers } from 'redux';
import countReducer from './counter';

const rootReducer = combineReducers({
  counter: countReducer,
});

type RootStore = ReturnType<typeof rootReducer>;

export type { RootStore };
export default rootReducer;
