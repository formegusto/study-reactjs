import { combineReducers } from 'redux';
import countReducer from './counter';
import todosReducer from './todos';

const rootReducer = combineReducers({
  counter: countReducer,
  todos: todosReducer,
});

type RootStore = ReturnType<typeof rootReducer>;

export type { RootStore };
export default rootReducer;
