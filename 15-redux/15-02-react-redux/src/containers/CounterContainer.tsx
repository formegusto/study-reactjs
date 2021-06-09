import React, { Dispatch, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CounterComponent from '../components/CounterComponent';
import { RootStore } from '../store';
import { CounterAction } from '../store/counter/actions';
import { DECREMENT, INCREMENT } from '../store/counter/types';

function CounterContainer() {
  const number = useSelector<RootStore, number>(
    ({ counter }: RootStore) => counter.number,
  );
  const dispatch = useDispatch<Dispatch<CounterAction>>();
  const increase = useCallback(() => dispatch({ type: INCREMENT }), [dispatch]);
  const decrease = useCallback(() => dispatch({ type: DECREMENT }), [dispatch]);

  return (
    <CounterComponent number={number} increase={increase} decrease={decrease} />
  );
}

export default CounterContainer;
