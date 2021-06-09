import { connect } from 'react-redux';
import { RootStore } from '..';
import { counterActions } from './actions';

const mapState = ({ counter }: RootStore) => ({
  number: counter.number,
});

/*
const mapDispatch = (dispatch: Dispatch<CounterActionType>) => ({
  increase: () => {
    dispatch(CounterActionCreators.increase());
  },
  decrease: () => {
    dispatch(CounterActionCreators.decrease());
  },
});
*/

/*
const mapDispatch = (dispatch: Dispatch<CounterAction>) =>
  bindActionCreators(counterActions, dispatch);
*/

export const CounterConnector = connect(mapState, counterActions);
