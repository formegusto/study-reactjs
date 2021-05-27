import React, { useReducer } from "react";

type State = {
  value: number;
};

type Action = {
  type: string;
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { value: state.value + 1 };
    case "DECREMENT":
      return { value: state.value - 1 };
    default:
      return state;
  }
}

function CounterReducerComponent() {
  const [state, dispatch]: [State, (a: Action) => void] = useReducer(reducer, {
    value: 0,
  });

  return (
    <div>
      <p>
        현재 카운터 값은 <b>{state.value}</b>
      </p>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
    </div>
  );
}

export default CounterReducerComponent;
