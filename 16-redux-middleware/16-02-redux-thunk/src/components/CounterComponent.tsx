import React from "react";
import { ConnectedProps } from "react-redux";
import CounterConnector from "../store/counter/connector";

type Props = ConnectedProps<typeof CounterConnector>;

function CounterComponent(props: Props) {
  return (
    <div>
      <h1>{props.number}</h1>
      <button onClick={props.decreaseAsync}>-</button>
      <button onClick={props.increaseAsync}>+</button>
    </div>
  );
}

export default CounterComponent;
