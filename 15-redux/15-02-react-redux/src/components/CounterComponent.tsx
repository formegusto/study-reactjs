import React from 'react';
import { ConnectedProps } from 'react-redux';
import { CounterConnector } from '../store/counter/connector';

type Props = ConnectedProps<typeof CounterConnector>;

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
