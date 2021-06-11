import React from "react";

type Props = {
  counter: number;
  increaseAsync: () => void;
  decreaseAsync: () => void;
};

function CounterComponent({ counter, increaseAsync, decreaseAsync }: Props) {
  return (
    <>
      <h1>{counter}</h1>
      <hr />
      <button onClick={decreaseAsync}>-</button>
      <button onClick={increaseAsync}>+</button>
    </>
  );
}

export default CounterComponent;
