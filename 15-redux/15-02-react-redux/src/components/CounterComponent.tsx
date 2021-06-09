import React from 'react';

type Props = {
  number: number;
  increase: () => void;
  decrease: () => void;
};

function CounterComponent(props: Props) {
  return (
    <div>
      <h1>{props.number}</h1>
      <div>
        <button onClick={props.increase}>+1</button>
        <button onClick={props.decrease}>-1</button>
      </div>
    </div>
  );
}

export default CounterComponent;
