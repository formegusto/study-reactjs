import { connect } from "react-redux";
import { RootStore } from "../";
import CounterActionCreators from "./actions";
import { CounterStore } from "./";

const mapState = ({ Counter }: RootStore): CounterStore => ({
  number: Counter.number,
});

const CounterConnector = connect(mapState, CounterActionCreators);
export default CounterConnector;
