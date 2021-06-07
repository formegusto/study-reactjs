import { combineReducers } from 'redux';
import countReducer, { CounterStore } from './counter';

export type RootStore = {
  counter: CounterStore;
};

export const rootReducer = combineReducers<RootStore>({
  counter: countReducer,
});
