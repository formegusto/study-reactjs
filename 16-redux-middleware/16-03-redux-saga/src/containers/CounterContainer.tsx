import React from "react";
import { ConnectedProps } from "react-redux";
import CounterComponent from "../components/CounterComponent";
import CounterConnector from "../store/counter/connector";

type Props = ConnectedProps<typeof CounterConnector>;

function CounterContainer(props: Props) {
  return (
    <CounterComponent
      counter={props.counter}
      increaseAsync={props.increase_async}
      decreaseAsync={props.decrease_async}
    />
  );
}

export default CounterConnector(CounterContainer);
