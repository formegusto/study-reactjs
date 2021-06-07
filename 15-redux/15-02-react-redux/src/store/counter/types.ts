const CounterActions = {
  INCREMENT: 'counter/INCREASE',
  DECREMENT: 'counter/DECREASE',
};

type CounterActionType = {
  type: typeof CounterActions.INCREMENT | typeof CounterActions.DECREMENT;
};

export { CounterActions };
export type { CounterActionType };
