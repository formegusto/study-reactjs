import { Dispatch } from 'react';
import { connect } from 'react-redux';
import { RootStore } from '..';
import { CounterActionCreators } from './actions';
import { CounterActionType } from './types';

const mapState = (state: RootStore) => ({
  number: state.counter.number,
});

const mapDispatch = (dispatch: Dispatch<CounterActionType>) => ({
  increase: () => {
    dispatch(CounterActionCreators.increase());
  },
  decrease: () => {
    dispatch(CounterActionCreators.decrease());
  },
});

export const CounterConnector = connect(mapState, mapDispatch);
